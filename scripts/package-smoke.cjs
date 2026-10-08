const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

async function main() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-package-'));
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const options = { cwd: directory, encoding: 'utf8', env: { ...process.env, npm_config_cache: path.join(directory, 'cache') } };
  try {
    const supplied = process.argv[2];
    const tarball = supplied ? path.resolve(supplied) : path.join(directory, JSON.parse(execFileSync(npm,
      ['pack', '--ignore-scripts', '--json', '--pack-destination', directory],
      { ...options, cwd: path.resolve(__dirname, '..') }))[0].filename);
    fs.writeFileSync(path.join(directory, 'package.json'), '{"private":true}');
    execFileSync(npm, ['install', tarball, '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], options);
    const packageRoot = path.join(directory, 'node_modules/@thornfe/jira-xml-parser');
    const { readEntityFile, readObjectFile } = require(packageRoot);
    for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'licenses/sax-1.4.1-LICENSE', 'dist/index.d.ts']) {
      assert.ok(fs.existsSync(path.join(packageRoot, name)), `Missing package file: ${name}`);
    }
    const file = path.join(directory, 'input.xml');
    fs.writeFileSync(file, '<root><Issue id="1"><description>Hello</description></Issue></root>');
    assert.deepEqual(await readEntityFile(file, ['Issue']), { Issue: [{ id: '1', description: 'Hello' }] });
    fs.writeFileSync(file, '<backup><data tableName="T"><column name="A"/><row><null/></row></data></backup>');
    assert.deepEqual(await readObjectFile(file, ['T']), { T: [{ a: null }] });
    await assert.rejects(readEntityFile(path.join(directory, 'missing'), ['Issue']), { code: 'ENOENT' });
    console.log('Package smoke passed on ' + process.version);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

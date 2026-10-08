# @thornfe/jira-xml-parser

Read selected records from Jira `entities.xml` and Active Objects
`activeobjects.xml` backups in Node.js. Includes TypeScript declarations.

## Installation

```sh
npm install @thornfe/jira-xml-parser
```

Runtime and development: Node.js 24.21.0 (or a newer 24.x release), with pnpm 10.
The repository pins Node.js 24.21.0 in `.nvmrc` and `.node-version`.

## Usage

```typescript
import { readEntityFile, readObjectFile } from '@thornfe/jira-xml-parser';

async function main() {
  const entities = await readEntityFile('entities.xml', ['Issue', 'Project']);
  console.log(entities.Issue);

  const tables = await readObjectFile('activeobjects.xml', ['AO_60DB71_SPRINT']);
  console.log(tables.AO_60DB71_SPRINT ?? []);
}

main().catch(console.error);
```

CommonJS is also supported:

```javascript
const { readEntityFile } = require('@thornfe/jira-xml-parser');
```

## API

### `readEntityFile(filename, entities, filter?)`

Returns `Promise<EntityRecords<T>>`, keyed by each requested `EntityType`.
Missing entities return empty arrays. Entity names are case-sensitive; use
`ENTITY_MAP` for the supported names. Selection arrays are not modified.

Attributes remain strings. Direct child fields are flattened by tag name;
ordinary text and CDATA are concatenated with whitespace preserved. Empty
child fields become `''`. Repeated child names use the last value. This is a
Jira record reader, not a general-purpose XML-to-JSON tree conversion.

The optional synchronous filter receives the raw `XmlNode` before flattening,
including attributes, `_tag`, `_level`, and optional `children`/`text`:

```typescript
const records = await readEntityFile('entities.xml', ['Action'], record => {
  return record.issue === '10011';
});
```

Filter exceptions reject the returned Promise.

### `readObjectFile(filename, tables)`

Returns `Promise<ObjectRecords>`, mapping table names to arrays of rows.
Requested tables present in the document are included, even when empty;
absent tables are omitted. Column names are lowercased. Cell values remain
strings, except `<null/>`, which becomes JavaScript `null`. Empty strings and
leading/trailing whitespace are preserved. Inconsistent row widths reject.

Both readers scan the entire file, support unsorted records, and reject file
I/O errors, empty input, truncated documents, and detected parse errors. They
do not resolve until parsing completes. They do not validate Jira schemas.

### Memory and large files

Input is read incrementally, but the public functions **collect all selected
results in memory**. The object reader also retains one selected table's XML
nodes while parsing that table. Peak memory therefore depends on selected
data, not only the input stream's chunk size. Large fields also require memory
in the SAX parser. There is no public record stream, async iterator, or bounded
memory guarantee. Select fewer entity/table types and filter entity records
when possible; measure memory for your own backups.

The parser is a locally modified SAX implementation with limited validation,
not a hardened validator for arbitrary untrusted XML. Only UTF-8 input is
supported.

## Development

```sh
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

`pnpm dev` watches and rebuilds the library. See [CONTRIBUTING.md](CONTRIBUTING.md)
for tests and package smoke checks, and [CHANGELOG.md](CHANGELOG.md) for behavior
changes. Report security issues using [SECURITY.md](SECURITY.md).

## License

MIT for this project; see [LICENSE](LICENSE) and
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for incorporated software.

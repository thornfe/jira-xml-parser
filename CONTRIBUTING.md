# Contributing

Use Node.js 24.21.0 and pnpm 10 (`nvm install && nvm use`). Install dependencies with
`pnpm install --frozen-lockfile`, then run `pnpm check` (build, tests, lint,
and a smoke test of the actual npm tarball). `pnpm dev` rebuilds on changes.

For bug reports, include the Node.js version, expected behavior, actual result,
and a minimal **synthetic** XML example. Never attach a real Jira backup,
credential, private key, access token, or personal data. See SECURITY.md for
private reports.

Keep fixes focused and add regression tests for changed parsing behavior.
Preserve string contents and document intentional compatibility changes in
CHANGELOG.md. Tests belong in `test/cases/`; use temporary files for boundary
cases. The existing test cases and fixtures are preserved as compatibility inputs.
Do not change them to accommodate implementation changes. Use temporary
external probes when validating additional boundary cases.

The package smoke test builds a tarball in an OS temporary directory, installs
it into an empty consumer project without lifecycle scripts, and verifies
CommonJS loading, both readers, and shipped license files. It removes its
working directory on completion. No registry publication occurs.

CI runs the full suite and package smoke check on the Node.js version pinned
in `.nvmrc`. Changes to the runtime range must update package.json and the
Node.js version files together.

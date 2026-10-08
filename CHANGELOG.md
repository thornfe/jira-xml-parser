# Changelog

## 1.0.0 — 2026-10-08

- Require Node.js 24.21.0 or newer within the 24.x line, with matching version
  files and CI. Upgrade Chai, Mocha, ESLint, TypeScript and their type/lint packages;
  remove unused ts-mocha and es-toolkit dependencies.
- Reject file errors, empty/truncated documents, detected malformed closing
  tags, invalid numeric references, and exceptions raised by filters/row parsing.
- Read the full document without assuming entity/table sort order; do not mutate
  caller selection arrays.
- Preserve entity text and CDATA, and correctly restore parent nodes between
  sibling fields. Ignore indentation between entity child fields.
- Preserve Active Objects strings without trimming; represent null cells as
  `null` and empty strings as `''`. Reject inconsistent row widths.
- Handle prototype-like XML names safely and use Node writable stream error
  handling and incremental UTF-8 decoding.
- Export result/filter/node types and correct the README API examples and memory
  limitations. `XmlReader` was never exported by this package.
- Retain third-party license notices in packages and add CI and package smoke
  checks. Preserve existing test cases, fixtures, and expected results unchanged.

Compatibility: whitespace-preserving cells, explicit nulls, newly retained text,
and rejection of previously hanging/partially accepted inputs are intentional
behavior changes. No streaming result API is introduced in this release.

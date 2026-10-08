# Third-party notices

## sax-js 1.4.1

The parser in `src/sax-ts/` is a modified derivative of
[sax-js](https://github.com/isaacs/sax-js). The lockfile immediately before
commit `9b8fdece6ed9b8a5f062c773ee1484c10b0c223c` records `sax@1.4.1`
with a local patch; that commit inlined the parser and removed the dependency.
Subsequent commits split and modified the implementation.

The original license is reproduced verbatim in
`licenses/sax-1.4.1-LICENSE`, obtained from the npm `sax@1.4.1` archive:
https://registry.npmjs.org/sax/-/sax-1.4.1.tgz

Local changes include entity/table selection support, reduced parser options,
stream error handling, and character/end-of-document validation. This fork
is not a drop-in replacement for the upstream SAX API.

## node-big-xml

The original node-big-xml copyright and MIT permission notice remain in
`LICENSE`.

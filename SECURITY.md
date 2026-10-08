# Security

Do not include real backups or credentials in public issues or pull requests.
For private disclosure, contact the maintainer at thornwu@163.com. Include
reproduction steps using synthetic data, affected versions, and impact. Do not
send active secrets. Security fixes target the latest release; this alpha
project does not promise a response-time SLA or backports.

The existing test XML and expected JSON are preserved as compatibility inputs
and contain key and credential-shaped data. They are excluded from the npm
package. Anyone who used those values in a real system should assess their
exposure and rotate/revoke them separately. Fixture sanitization and Git
history cleanup are outside this implementation change.

For large or untrusted input, enforce file-size, memory, time, and access limits
in the calling application. This modified XML parser is not a full XML/schema
validator and its collection APIs retain matching records in memory.

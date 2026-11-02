# Manual release publication

`fdupdate-publisher` is the short-lived offline publication boundary. It consumes canonical `fdupdate/publication-plan/v1` JSON plus `fdupdate/build-evidence/v1` records, verifies each bounded artifact byte-for-byte, signs artifact metadata and the canonical release manifest, stages an invisible hawkBit distribution, and atomically installs immutable content before activation.

The caller supplies a `SigningAuthority` only for one explicit operator or manual `workflow_dispatch` operation. The authority cannot be formatted or serialized. Stored artifacts, evidence, receipts, backend tokens and errors contain no private key material. Runtime server and updater components do not depend on this crate.

`PublicationBackend` is the private hawkBit transaction adapter. `prepare` must create an invisible distribution, `commit` makes it deployable, and `abort` is idempotent. Failed evidence is rejected before preparation. Failed activation removes the newly staged immutable directory and aborts the upstream transaction while preserving all earlier releases.

Focused verification:

```text
cargo test -p fdupdate-publisher --test publication --locked
cargo clippy -p fdupdate-publisher --all-targets --locked -- -D warnings
```

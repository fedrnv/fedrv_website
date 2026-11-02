# Server rollout policy

`fdupdate-rollout` assigns approved installation IDs to deterministic cumulative waves using a stable salt. Each wave contains only its newly added cohort. The controller advances only after every member reports and the failure rate is at or below the configured threshold.

Missing telemetry, a threshold breach or an operator pause leaves the same wave paused. Resumption is an explicit resolution that clears ambiguous reports and retries that wave; it cannot skip forward. Conflicting duplicate feedback is rejected. FDU-031 adds the mandatory exact-artifact validation-stand promotion gate before this base controller may create a production fleet rollout.

Rollback uses a separate Ed25519 domain and binds the authorization ID, product/component target, exact installed version, exact older destination version, immutable artifact SHA-256 and sequence. The authorization cannot approve another product, component, source version, destination version or artifact. FDUpdater still applies its local signature, compatibility, exact `from_version`, artifact-integrity and health rules.

Focused verification:

```text
cargo test -p fdupdate-rollout --test policy --locked
cargo clippy -p fdupdate-rollout --all-targets --locked -- -D warnings
```

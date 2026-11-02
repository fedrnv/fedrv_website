# FDUpdate Server registry

`fdupdate-server-registry` owns the product-scoped boundary between signed installation enrollment and private hawkBit target state. Callers provide an authenticated tenant/product `RegistryScope`; the registry never derives scope from client-controlled metadata.

Products and their allowed component IDs are imported idempotently before enrollment. An enrollment request is verified with the installation public key and bound to one instance, tenant, product, component set and nonce. Repeating the exact request returns the existing state. A different key, request or scope for an existing instance fails as a conflict. Reusing one installation public key, nonce or signed request for another instance also fails.

Enrollment remains pending until an authenticated operator explicitly calls `approve`; polling only returns the current signed decision. Approval reconciles a deterministic private hawkBit controller ID and returns the signed client decision defined by `fdupdater-enrollment`. Installation credentials are deterministically derived from a separately supplied server credential key, stored only as hashes, and can be rotated. Revocation removes the credential, disables the upstream target, and returns a signed credential-free revoked decision on later polling. Pending, denied, revoked, wrong-product and wrong-tenant access fails closed.

`HawkbitRegistry` is the narrow Management API adapter boundary. Its calls are safe to repeat and registry state changes only after upstream reconciliation succeeds. FDU-021 supplies the authenticated operator API/CLI and audit persistence; FDU-035 supplies the approval panel. Private signing and credential keys must come from a host secret provider and never from repository configuration.

`export_json` emits a bounded credential-free registry snapshot for a transactional durable store, and `from_json` verifies every product, signed enrollment request, fingerprint, state transition invariant and audit sequence before restoring it. The snapshot contains only credential hashes. Using a different credential authority after restore fails closed instead of issuing a replacement credential implicitly.

Approved clients also report product-neutral installed application state through the authenticated application check path. Schema-2 reports bind a canonical request ID, installation, product/component, platform/architecture, local Release/Prerelease channel, installed version, client observation time, server receipt time, optional last successful update, health and a bounded error. Registration, release assignment and reported installation remain separate facts. A publication or assignment never becomes an installed version implicitly.

A managed FDUpdater receives application authority only from an explicit operator binding. The binding names the exact updater instance, product/component, repository, platform, architecture and local channel, and carries separate check and update permissions. Creating or changing a binding uses an expected revision. A stale revision conflicts; disabling a binding advances its revision and immediately denies checks, packages and reports. Repository removal, installation revocation and binding changes are rechecked on every phase, so an older assignment cannot preserve authority. Check-only access may submit authenticated installed-state inventory but receives no release assignment or bytes.

The registry keeps bounded recent per-installation history and projects current state by the newest client observation. Exact retries are idempotent; a reused request ID with different content is a conflict. Delayed offline reports remain in history without replacing newer current state. Successful, failed and rollback outcomes are bound to the authenticated assignment and server-derived repository. Pending, denied, revoked, wrong-instance, wrong-product/component, future-dated and cross-repository reports fail closed. Schema-6 snapshots require the report collection explicitly, schema 7 requires managed-updater heartbeat state, and schema 8 requires the managed-application binding collection. Older snapshots migrate missing collections to an empty state that grants no authority.

Focused verification:

```text
cargo test -p fdupdate-server-registry --locked
cargo clippy -p fdupdate-server-registry --all-targets --locked -- -D warnings
```

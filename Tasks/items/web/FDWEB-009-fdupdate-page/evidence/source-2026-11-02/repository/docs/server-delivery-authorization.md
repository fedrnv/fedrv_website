# Metadata and artifact delivery authorization

The TLS server evaluates every metadata and artifact request before reading or returning a payload. It authenticates the per-installation credential against the approved public-key enrollment, verifies tenant/product/component scope, confirms the installation belongs to the selected rollout cohort, and consumes a bounded request ID to reject replay.

Anonymous, pending, denied, revoked, wrong-product, wrong-component and unassigned callers receive neither metadata nor artifact bytes. Revocation is checked before replay state changes. Tenant-wide hawkBit credentials stay inside the server adapter; clients receive only signed release metadata and their own installation credential.

## Repository grants

Approval and repository access are separate decisions. A newly enrolled or newly
approved installation starts with no individual repository grant. The effective
set is the union of individual grants and the current allowlist of the installation
key that admitted it. The operator API changes individual grants with authenticated
requests to:

- `POST /v1/operator/repositories/grant`
- `POST /v1/operator/repositories/revoke`

Both accept `tenant`, `product_id`, `instance_id`, and the repository
`project_key`. The grant operation requires an approved installation. A revoked
grant takes effect on checks, package downloads, digest downloads, and reports,
including assignments created before the revocation.

Changing an installation key allowlist takes effect at the next metadata,
package, digest, or report authorization check. Removing a repository therefore
removes inherited access without rewriting every installation. Disabling a key
controls only new admission. `updates_suspended` is a separate audited policy:
while set, all existing installations admitted by that key lose its inherited
grants, but keep any explicit individual grants. Clearing the suspension restores
the then-current key allowlist. Revoking one installation credential remains
independent of all other installations that used the same key.

The device gateway searches only
`store/repositories/<project_key>/releases`. It validates the signed manifest,
matches the requested product, component, platform and architecture, filters the
requested channel, and then compares semantic versions. The Release channel
excludes prerelease versions. The Prerelease channel considers both stable and
prerelease versions using normal SemVer ordering. Each assignment identity binds
the installation, repository, exact product/component target, artifact digest,
complete signed-release envelope and exact Release or Prerelease policy through a
length-framed, domain-separated SHA-256 derivation. A later signed version,
sequence or channel receives its own identity even when it deliberately reuses the
same immutable artifact bytes. The resulting opaque `a-` identifier fits the
shared standalone action-ID limit; persisted identifiers from both previous
opaque derivations and the two earlier digest-suffix formats remain resolvable
only for their exact stored assignment and channel.
It persists the repository key that supplied it, and every later package or digest lookup repeats
the current grant check before opening that repository namespace.

The standalone client persists the exact local target selected by the successful
gateway check. Eligibility, status, download, activation, restart reconciliation
and outcome reporting all use that target. Other locally registered components,
including components whose signed artifacts contain identical bytes, require
their own check and assignment before they can change.

Repository grants are stored atomically with the installation registry. Older
registry snapshots deserialize with an empty grant set, so migration does not
authorize repositories based on matching product, component, or version. Older
assignments have no repository provenance and cannot serve artifact bytes; the
installation must check again after an explicit grant to receive a new assignment.

## Managed application bindings

Repository access alone does not authorize a managed updater to check or update an application. An operator must also create a revisioned binding through `POST /v1/operator/managed-applications/bind`. The request fixes one updater instance to an exact component, repository, platform, architecture and Release/Prerelease channel and sets `check_allowed` and `update_allowed` independently. `update_allowed` requires check access. `expected_revision` is zero for the first binding and must match the current revision for every reconciliation.

`POST /v1/operator/managed-applications/unbind` disables both permissions and advances the revision without losing the replay barrier. The gateway rechecks the current binding before assignment creation, package or digest delivery and outcome reporting. A channel change invalidates earlier-channel delivery immediately; a check-only binding records honest inventory and returns no assignment. These operator routes require the private gateway operator token and persist by atomic state replacement.

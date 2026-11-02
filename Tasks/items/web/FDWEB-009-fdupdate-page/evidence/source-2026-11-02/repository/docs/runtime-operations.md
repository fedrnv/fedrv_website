# FDUpdater runtime operations

The installed service reads one administrator-owned `FDUpdater.json`. Linux starts
it as `FDUpdater service --name NAME --config /absolute/FDUpdater.json`; Windows
registers the equivalent SCM image path. Startup rejects an absent file, unknown
JSON fields, relative or aliased paths, non-loopback API addresses, overlapping
target/state roots, unreadable credentials and trust, or an unsafe provider
endpoint. The service recovers every durable transaction before accepting API
mutations.

Start from `packaging/common/FDUpdater.example.json` and provision the completed
file before install. The reader and operator credential files must be distinct.
Give the service read access to configuration, public trust, provider metadata and
artifacts; give it write access only to its state root and registered application
installation roots. Signing private keys never belong on the device.

`poll_interval_seconds` controls the normal remote-work cadence. The optional
`retry` block sets the initial and maximum retry delay and the maximum
deterministic jitter. Repeated distribution, enrollment or application transport
failure persists an exponential retry deadline in the state root, so restart does
not create a request burst. A successful remote cycle clears the retry streak.
Watchdog supervision continues on the normal cadence while remote work backs off.

`provider.kind` is `manifest`, `remote_manifest`, `gateway` or `hawkbit`. A manifest provider
reads a locally administered signed envelope and resolves its artifact only as
`ARTIFACT_ROOT/SHA256.artifact`. A remote-manifest provider reads a public HTTPS
signed-release URL, either an exact immutable release or a `no-store` latest-publication
endpoint, and downloads only the artifact URL covered by that signature. It disables redirects and proxies, bounds metadata and
artifact bytes, verifies TLS, signature, size and SHA-256, and optionally accepts
one administrator-provisioned PEM root certificate. A hawkBit provider requires an HTTPS base URL,
tenant, controller ID and a separate target-token file; an optional PEM root file
pins a private deployment CA. Both providers produce the same signed-release
contract, and product trust still authorizes every artifact.

A gateway provider points `endpoint` at the product-scoped application route,
for example `https://update.example/v1/application/default/fdos/`. Every
standalone target using this provider also configures its product-scoped
`enrollment.endpoint`. FDUpdater creates and protects the installation key under
`state_root`, polls enrollment until an administrator approves it, and uses the
returned per-installation credential for check, package and report requests. The
server-side repository grant selects which repository may supply the release;
the client stores no publisher key, administrator session or share credential.

The gateway endpoint must use HTTPS, contain no credentials, query or fragment,
and end with `/`. Redirects are rejected. `root_certificate_file` may pin a
private deployment CA. Package responses are streamed with the signed size bound
and then pass the normal signature, digest, compatibility, channel, readiness and
rollback pipeline. A pending gateway assignment stores its local target so
restart recovery can reacquire only that installation's current credential and
report the final result.

Each `targets` entry fixes the product/component instance, platform, architecture,
installation root, executable name, service binding, health policy, data roots and
initial version. Lifecycle commands and paths come only from this local entry.
Set `manual_apply` to `true` for a target whose releases may be discovered by the
normal polling cycle but may be activated only by an authenticated explicit
`apply` action. The field defaults to `false` for compatibility, so existing
targets retain automatic activation.
Optional enrollment, readiness, watchdog and diagnostics blocks use separate
credentials and loopback endpoints where applicable. An application-managed
target also requires enrollment and the root `application_updates` HTTPS endpoint.

Use the packaged binary and a provisioned credential to inspect or control the
runtime:

```text
FDUpdater status --endpoint 127.0.0.1:17483 --credential-file READER
FDUpdater check --instance INSTANCE --product PRODUCT --component COMPONENT --endpoint 127.0.0.1:17483 --credential-file READER
FDUpdater apply --instance INSTANCE --product PRODUCT --component COMPONENT --expected-sequence SEQUENCE --expected-version VERSION --expected-action-id ACTION_ID --expected-release-sha256 RELEASE_SHA256 --endpoint 127.0.0.1:17483 --credential-file OPERATOR
FDUpdater pause --instance INSTANCE --product PRODUCT --component COMPONENT --endpoint 127.0.0.1:17483 --credential-file OPERATOR
FDUpdater resume --instance INSTANCE --product PRODUCT --component COMPONENT --endpoint 127.0.0.1:17483 --credential-file OPERATOR
FDUpdater diagnostics --endpoint 127.0.0.1:17483 --credential-file READER
FDUpdater enrollment --endpoint 127.0.0.1:17483 --credential-file READER
FDUpdater app-updates --endpoint 127.0.0.1:17483 --credential-file READER
```

Before `apply`, read `pending_rollout` from the target returned by `check` or
`status`. Pass its `sequence`, `version`, `action_id` and `release_sha256` as the
four `--expected-*` values above. FDUpdater compares that complete identity with
the currently pending signed release inside the serialized Apply operation. If
polling replaced the release, it is no longer pending, or any value differs,
Apply returns a conflict without downloading or activating another candidate;
run `check` again and review the new identity before retrying.

`status` reports durable current/previous versions, pending rollout, channel,
recovery state, watchdog state and incident summary. Provider or network failure
leaves the current slot intact. Verification, enrollment, readiness, lifecycle or
health failure denies completion and drives deterministic rollback. Restarting the
service repeats startup recovery before polling. Windows SCM stop and Linux
SIGINT/SIGTERM immediately cancel the shared lifecycle token and reject new API
mutations. An in-flight transition stops at its next durable cancellation boundary
and remains in a recoverable phase; the next service start completes recovery
before polling or accepting mutations.

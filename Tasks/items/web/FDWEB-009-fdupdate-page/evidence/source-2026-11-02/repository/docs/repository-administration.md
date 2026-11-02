# Repository administration

The private area of `fdupdate-web` is available under `/admin`. Administrator
identity is an individual canonical account ID. The durable account document
stores enabled/owner state, revisioned audit records and only a domain-separated
SHA-256 credential verifier. It never stores plaintext credentials. Set
`admin_account_state_file` to a protected state path; when omitted, it defaults
to `administrator-accounts.json` beside `admin_credential_file`.

On the first start without an account document, the runtime reads the existing
high-entropy `admin_credential_file` and migrates it to one enabled bootstrap
owner named by `admin_actor_id`. The migration commits atomically before login is
available, so an existing installation keeps access. Later starts use the account
document and no longer require the legacy credential file. Do not delete the
legacy file until one successful migrated start and protected-state backup have
been confirmed.

Account state schema v2 adds an ordered role set and explicit repository scopes.
Opening a valid v1 document migrates it atomically: existing owners keep their
owner capability and non-owner accounts remain enabled with `Reader` and no
repository scope, which grants no repository access. A failed migration preserves
the last valid document; restore that protected file or use `recover-owner` if no
owner credential remains usable.

An owner can create an account, disable an account or rotate its credential from
the panel. New and rotated 256-bit credentials appear on one non-cacheable page
only. Duplicate or malformed IDs fail closed, writes use revision checks and an
atomic replacement, and the last enabled owner cannot be disabled. Every account
mutation records the acting and subject account IDs without a credential. Other
administrative audit records use the account ID from the authenticated session.

Owners assign access from each account card. Repository scopes are canonical
project keys separated by commas. They must already exist and match exactly;
empty scope means no repository access. The runtime reloads current authorization
for every request, so role removal, scope removal and owner removal affect active
sessions immediately. The account audit records the actor, subject, resulting
owner flag, roles and scopes.

The web authorization matrix is:

| Capability | Required access |
| --- | --- |
| Accounts, repository creation, retention and server update | Owner |
| Inventory, repository metadata and authenticated download | Any assigned role plus the exact repository scope |
| Publishing-key rotation and revocation | `ReleaseManager` plus the exact repository scope |
| Product-wide installation approval, denial and identity revocation | `SecurityAdministrator` covering every repository for the product, or owner |
| Exact repository admission, visibility and temporary shares | `SecurityAdministrator` plus the exact repository scope |
| Enrollment codes | `SecurityAdministrator` covering every repository matching the product/component, or owner |
| Fleet status | Read-only `FleetOperator` or `SecurityAdministrator` plus the exact repository scope |

Owners bypass repository role and scope checks. Submitted project, product and
component IDs are resolved against the durable registry before a backend request.
Product-wide installation mutations require complete product coverage, and an
enrollment code requires complete coverage of the selected product/component.
Fleet status includes an installation when at least one repository for its
product is in scope, filters repository-grant names to those exact scopes, and
renders mutation controls only when the corresponding security authority is
complete. Role and scope changes affect that projection on the next request.
The repository adapter also filters reads and rejects mutations outside its
received scopes, so hiding a control in the page is never the authorization
boundary. Unknown, malformed and guessed identifiers fail closed.

A successful login creates a random 256-bit session and independent CSRF token.
The browser cookie is `HttpOnly`, `Secure`, `SameSite=Strict`, restricted to
`/admin` and bounded by the configured 5-minute to 24-hour lifetime. Account
enabled state is checked again on each request, so disabling an account rejects
its existing cookies immediately. Current roles and scopes are checked at the
same boundary. Sessions are intentionally lost on service restart.

The **Administrator sessions** panel lists only a random non-authorizing session
reference, account, server-observed TCP client address and creation/expiry times.
It never displays the cookie verifier or CSRF value. Every administrator can log
out, revoke one of their sessions or revoke all of their sessions. An owner can
inspect and revoke sessions for every account. A single-session revoke preserves
unrelated sessions. Disabling an account or rotating its credential revokes all
of that account's sessions immediately; host-local owner recovery is performed
while the service is stopped, and restart discards every prior session.

Authentication settings are stored atomically in
`administrator-auth-settings.json` beside the account document unless
`admin_auth_settings_state_file` selects another protected path. On the first
start, the existing `session_ttl_seconds` value initializes this document. Later
starts use the persisted document. Owners can configure these bounded values:

| Setting | Allowed range | Initial value |
| --- | --- | --- |
| Session lifetime | 300–86,400 seconds | Existing `session_ttl_seconds` |
| Failed logins before cooldown | 3–20 | 5 |
| Failure window | 60–3,600 seconds | 300 seconds |
| Cooldown | 30–3,600 seconds | 300 seconds |

Every change records the owner account and complete resulting non-secret settings.
Shortening the session lifetime also shortens existing sessions immediately;
increasing it applies to new sessions and does not extend cookies already issued.
Invalid, stale, corrupt and non-owner changes fail closed while preserving the
last valid file.

Login throttling is memory-bounded and keyed only by the web process's actual TCP
peer address. User-supplied `Forwarded`, `X-Forwarded-For` and `X-Real-IP` headers
are ignored. The supported edge removes those headers and applies its own stricter
`/admin/login` rate limit before proxying. With the standard single edge, the
application-level bucket is intentionally shared by traffic arriving from that
edge; this is conservative and prevents forged client headers from creating new
buckets. Restart clears in-memory failure counters while retaining the configured
limits.

If all usable credentials are lost, stop `fdupdate-web` and run the host-local
recovery command with access to the protected configuration and state directory:

```text
fdupdate-web recover-owner CONFIG.json ACCOUNT_ID
```

The command enables or creates the named owner, rotates its verifier, records a
`local-recovery` audit event and prints the new credential once. Start the service
again after securing that value. Running recovery while the service is accepting
traffic is unsupported; revision checks reject a stale subsequent writer rather
than overwrite the recovered state.

Every administrator page and response uses `Cache-Control: no-store`. Every mutation requires the current session and exact constant-time CSRF match. Request bodies are capped at 64 KiB. Administrator credentials, session tokens, CSRF tokens and publishing credentials are absent from repository audit and logs.

When the optional server-updater integration is configured, `/admin` also shows the exact managed FDUpdate Server target: current and previous versions, pending release, health and recovery. **Check for server updates** refreshes provider state. **Install server update** is shown only for a pending candidate and asks the independently running FDUpdater to apply it. Both actions require the active administrator session and current CSRF value; the web process never executes the deployment lifecycle itself.

Repository creation exists only in the authenticated panel. It captures project/display/product/component identity, public/private visibility and exact GitHub repository/workflow/environment/ref policy. The initial publishing key is returned on one non-cacheable success page. Rotation returns a new key once and invalidates the prior generation; revocation immediately denies publication. Later dashboard views show only key state and generation.

Each repository card can change visibility between **Public** and **Private**. The CSRF-protected change is persisted and audited before redirecting back to the panel. A public-to-private change immediately removes the repository, its manifests and ordinary artifact URLs from anonymous access; changing it back restores access only for provenance-bound, digest-verified publications.

The dashboard includes public and private repositories, repository/key audit, every publication's time, publisher, GitHub repository, commit SHA and comment, plus copyable authenticated download links. Private downloads require the active session and use `private, no-store`; anonymous routes continue to return the same 404 as an unknown repository.

Temporary private links are listed by non-secret grant ID, exact artifact, issue time, expiry and revocation status. An administrator can revoke one active grant through the session and CSRF-protected form; the store persists the actor and revocation time without the bearer token. Each new grant records the repository's visibility generation derived from its durable audit. Any public/private transition advances that generation, so a private-to-public-to-private cycle cannot restore an older link. Legacy temporary grants without a generation fail closed after this migration.

For a private artifact, choose a lifetime from 1 through 30 days and select **Create temporary link**. The field defaults to 10 days. The resulting HTTPS bearer URL is displayed once; copy it before leaving the page. Any holder can download that one exact digest repeatedly until expiry. The repository, manifest and other artifacts remain private. Expiry or changing the repository to Public invalidates the temporary private link. The server persists only a domain-separated verifier and exact project/release/digest target in `temporary-private-download-grants.json`; plaintext tokens do not enter durable state or edge access logs. Legacy one-time links retain their consume-before-stream behavior.

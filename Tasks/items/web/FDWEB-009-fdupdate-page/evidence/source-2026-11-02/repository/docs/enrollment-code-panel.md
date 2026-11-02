# Enrollment codes and installation identities

The installation identity page in `fdupdate-server-panel` uses the existing security-administrator role and exact tenant/product scope. It lists installation ID, product, assigned component target, public-key fingerprint, enrollment state, creation time, last successful authenticated-seen time and revocation state. The response contains no private key, access credential, enrollment-code verifier or reusable secret.

A security administrator may issue a code for one registered product/component and an expiry from 60 seconds through 24 hours. The server generates 256 random bits, returns the lowercase hexadecimal plaintext on a one-time response page and persists only a domain-separated SHA-256 verifier plus code ID, scope, issue/expiry time and usage state. Operator and registry audit trails record issuance without plaintext.

The installation generates and retains its Ed25519 private key locally. A rate-limited enrollment submission must match the code scope and expiry. Successful consumption and creation of the pending identity commit together in the registry snapshot; it does not approve the identity or return targets or an access credential. Wrong-scope, expired, invalid and reused codes fail closed.

Revocation verifies the selected public-key fingerprint, disables the hawkBit target and removes the server-side credential hash before the audited panel action succeeds. Registry authentication then denies status/report access, and the delivery authorizer denies metadata and artifact requests. Reusing the old request with a fresh code cannot restore a revoked public-key identity.

CLI transports use `enrollment-code-issue TENANT PRODUCT COMPONENT EXPIRES_UNIX`, `installation-list TENANT PRODUCT` and the existing `installation-revoke TENANT PRODUCT INSTANCE FINGERPRINT REASON` operator actions.

The live `/admin` transport applies the authenticated session and CSRF check
before calling the private device-gateway operator API. It shows the current
fingerprint, state, last-seen time and repository grants, and exposes separate
approve, deny, identity revoke, repository grant and repository revoke actions.
The web service receives only the gateway operator token copied into its own
root-owned secret directory; that token is never rendered or sent to a browser.

The panel issues the one-time plaintext through
`POST /admin/installations/enrollment-code`. A standalone target may provision it
in `enrollment.code_file`; FDUpdater sends it only in the protected enrollment
request together with the exact component ID. The gateway atomically consumes
the persistent verifier and creates a pending identity. Exact retries from that
same cryptographic request remain idempotent, while a different installation,
wrong component, expired code or malformed code is rejected. Approval and
repository grant remain two explicit later browser actions.

## Reusable installation keys

A security administrator with complete repository authority for a product can
create and manage reusable installation keys on `/admin`. The create form records
a display name, product and component scope, repository allowlist, optional
expiry, and an installation limit. The limit defaults to one and accepts bounded
values such as 1, 10, or 100. The generated plaintext key is returned once in a
`no-store` response. The dashboard and gateway subsequently expose only its
stable identifier and verifier-backed metadata.

Each key card shows its creator, state, expiry, used and remaining quota, current
repository allowlist, and the immutable registration history. Registration rows
identify the independently generated installation identity and whether it was
revoked. Quota counts distinct successful registrations; an exact retry does not
consume another slot, and lowering the limit never deletes historical usage.

Editing a key can rename it, change its repository allowlist, or raise or lower
its quota. `Disable new enrollment` stops admission while preserving inherited
access for existing installations. `Suspend inherited update access` separately
removes the key's repository authority from every derived installation until an
administrator restores it. Individual installation revocation remains available
through the existing fingerprint-confirmed action and does not revoke sibling
installations.

All installation-key actions require an authenticated security-administrator
session, a valid CSRF token, and complete product repository scope. The web
service checks submitted product, repository, and key identifiers against its
bounded authoritative inventory before calling the private gateway routes:
`POST /v1/operator/installation-keys`,
`POST /v1/operator/installation-keys/list`, and
`POST /v1/operator/installation-keys/update`.

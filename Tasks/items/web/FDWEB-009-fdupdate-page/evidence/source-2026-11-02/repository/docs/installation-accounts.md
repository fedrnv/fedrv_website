# Installation Accounts

Installation Accounts are human download and delegated-enrollment identities.
They are separate from administrator accounts, repository publishing credentials
and the Ed25519 identity/credential generated for each installed software
instance.

The durable account domain is owned by `fdupdate-installation-accounts`. IDs use
UTC `YYMMDDNN`, where `NN` is the first unused sequence from `00` through `99`
for that date. A day cannot create a 101st account; it fails explicitly instead
of changing the identifier shape or reusing an ID.

Email login is normalized to trimmed lowercase ASCII and must be unique. The
server generates a 192-bit initial password, returns it once, stores an Argon2id
verifier and requires a password change. Account views, audit and `Debug` never
contain password material. A positive installation limit is exact; `None` means
unlimited. Repository grants contain only canonical exact project keys and do
not derive authority from product or component names.

## Owner administration

The authenticated `/admin` page contains a separate **Installation Accounts**
section. Owner authority and a current CSRF value are required to create an
account, change its exact private-repository grants or installation limit,
enable or disable it, and reset its password. Public and unknown repositories
are rejected as grants. A limit is either one positive integer or explicitly
unlimited.

Creation and reset return a `no-store` page containing the Installation ID and
generated password once. Later dashboards show only safe account metadata and
bounded audit. Reset invalidates the prior password immediately; disablement
prevents authentication immediately. Future Installation Account sessions and
download or enrollment requests must re-read current enabled state and grants
rather than treating their initial session projection as durable authority.

Deployment stores `installation-accounts.json` beside the other mutable web
runtime state under the service-writable web data directory. It is not placed in
the root-owned secret directory, and that directory remains read-only to the web
service.

## Confirmation and self-service

The owner configures one FDUpdate-private Email channel through COT. Its
protected setup binds the sender account and SMTP provider configuration, while
each message supplies exactly one validated Installation Account recipient.
SMTP credentials pass directly from the protected owner form into COT custody;
FDUpdate retains only the opaque channel identity and revision. FDUpdate never
persists SMTP credentials or a recipient-specific COT resource.

New accounts remain unusable until their current email is confirmed. The
Installation Account portal supports login by ID or normalized email, forced
initial password change, password recovery and confirmed email replacement.
Confirmation and recovery links are short-lived, single-use and replaced by a
newer challenge of the same kind. Only a SHA-256 digest of each random token is
stored. Passwords are never sent by email. Password recovery, email replacement,
owner reset, authority changes and disablement revoke existing Installation
Account sessions.

The dynamic-recipient contract uses the typed COT SDK published at revision
`9f720a6ed5a68dd1fa5df5716fdf7bea57e67c0e` and an isolated conforming fixture.
The same immutable COT candidate is deployed on the authorized VPS and its live
health probe passes. FDUpdate treats compatibility as verified only when the
typed fixture, security, UI, deployment and redaction checks all pass against
that exact pin; the upstream task's unrelated open lifecycle state is not a
runtime compatibility signal.

Delegated software enrollment uses the account password only as transient proof.
The account's current grants must cover the installation's exact requested
repository set, and its optional installation limit counts distinct signed
software identities. Exact retries are idempotent; successful software receives
an independent installation credential. The human password is never persisted
in updater or registry state.

Registration audit idempotency is bound to a domain-separated semantic attempt:
the digest of the signed enrollment request, tenant/product/component scope,
provenance, resolved Installation Account ID when available, software instance
and exact sorted repository set. Occurrence time and outcome do not change that
attempt identity; outcome remains a separate audit transition key. Consequently
an exact retry produces no duplicate row, while two repository/provenance/account
variations remain distinct durable attempts even when they reuse one signed
software identity. Audit schema v1 records migrate deterministically to v2 from
their stored request digest and redacted semantic fields. Passwords, email,
request bodies, installation credentials and signed decisions are neither inputs
persisted in the audit nor exposed by its query.

## Private download portal

After the required password change, `/installation-account` projects only the
account's current exact grants that are still private. Each published release
lists its digest-bound artifacts. Downloads use authenticated
`/installation-account/downloads/{project}/{release}/{sha256}` routes, support
HTTP ranges, verify the stored bytes against the published digest and return a
concealed 404 for public, unknown, ungranted or mismatched targets. The account
session grants no administrator or publication authority.

An account can create a bearer link for one listed artifact for 1 through 30
days; the form defaults to 10 days. The plaintext HTTPS URL is shown once, while
the portal inventory keeps only its non-secret grant ID, exact target, expiry
and status. The same link can download the same verified bytes repeatedly until
expiry or account revocation. Its owner can revoke it from the portal with the
current session and CSRF token.

Every account-created link is additionally bound to its Installation Account.
Redemption re-reads the current enabled account, confirmed email and exact
repository grants. Removing the grant, disabling the account, losing current
email confirmation, expiry, explicit revocation, or any public/private
visibility transition invalidates the link immediately. A later transition
back to private does not resurrect it. Other accounts cannot list or revoke the
grant, even when they share repository access.

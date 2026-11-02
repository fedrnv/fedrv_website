# FDUpdate Server foundation deployment

FDU-017 provides the first supported server foundation: one `linux/amd64` host,
Docker Engine with the Compose v2 plugin, Eclipse hawkBit 1.1.0, MariaDB 11.4 and
an nginx TLS/mTLS edge. All three images are pinned by immutable registry digest.
Only the edge publishes a host port. hawkBit, its Management API, MariaDB and the
artifact directory remain private.

The foundation is deliberately sealed. `/healthz` is the only anonymous route.
`/operator-ready` returns 204 only with a client certificate signed by the
configured operator CA. Every other route returns 401 until the FDUpdate gateway
implemented by later Epic 002 tasks owns device and operator authorization. Do not
publish hawkBit directly.

## Trusted public TLS

After public DNS points at the host and inbound TCP 80/443 is allowed, expose the
edge with a trusted ACME certificate through the deployment CLI:

```bash
sudo ./server/deploy/fdupdate-server public-tls \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server \
  --server-name update.example.com \
  --acme-email operations@example.com
```

The command obtains an ECDSA certificate with Certbot's standalone HTTP-01
listener, changes only the edge binding to `0.0.0.0:443`, recreates the edge and
installs a renewal deploy hook. The hook atomically copies renewed transport
material and recreates the edge; hawkBit and MariaDB remain unpublished. Omitting
`--acme-email` uses Certbot's explicit no-email registration mode.

## Host prerequisites

- A dedicated x86-64 Linux host with a current Docker Engine and Compose v2.
- `bash`, GNU coreutils, `curl` and OpenSSL.
- Root access for configuration creation and lifecycle changes.
- Host firewall policy for the selected listener. The generated configuration
  binds `127.0.0.1:8443`; changing it to `0.0.0.0` is an explicit operator action.

Executable releases, configuration and durable data use separate roots:

```text
/opt/fdupdate-server          versioned compose/nginx releases and current/previous links
/etc/fdupdate-server          deployment.env, runtime secrets and TLS/mTLS material
/var/lib/fdupdate-server      MariaDB and immutable artifact bytes
```

Release-signing keys never belong in any of these runtime containers. The TLS and
operator CA keys created below are transport identity material. They remain in the
root-only host configuration directory and are not mounted into containers except
for the server TLS key itself; replace the acceptance PKI under your operational
CA before exposing a production listener.

## Clean install

From an exact repository checkout, create the private configuration and validate
the candidate before starting containers:

```bash
sudo ./server/deploy/fdupdate-server init-config \
  --config-root /etc/fdupdate-server \
  --server-name updates.example.internal

sudo ./server/deploy/fdupdate-server validate \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server

sudo ./server/deploy/fdupdate-server install \
  --release-id fdu-017-hawkbit-1.1.0 \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server
```

`init-config` fails if the destination already exists. It creates random MariaDB
and hawkBit credentials, enables only per-target DDI authentication, disables the
gateway-wide token, anonymous downloads, DMF and Swagger, and creates a private
acceptance PKI. The Compose deployment waits for every health probe. A failed
clean install removes the active link and stops its partial services while keeping
the release directory for diagnosis.

Run the live acceptance path on the same host:

```bash
sudo ./server/deploy/fdupdate-server acceptance \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server
```

This checks all three running services, verifies the edge certificate, proves that
unauthenticated device/admin/operator requests receive 401, proves that an
operator client certificate reaches the mTLS diagnostic, and confirms that
hawkBit and MariaDB have no published host ports.

## GitHub publisher gateway

Build the gateway locally from the reviewed source, prepare a JSON array of exact
publisher registrations, and install the binary through the deployment CLI:

```bash
cargo build --release --locked -p fdupdate-github-publisher --bin fdupdate-publisher-gateway
sudo ./server/deploy/fdupdate-server install-publisher-gateway \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server \
  --gateway-binary "$PWD/target/release/fdupdate-publisher-gateway" \
  --registrations-file "$PWD/publisher-registrations.json"
```

The command creates an unprivileged `fdupdate-gateway` service account, generates
the raw 32-byte release-signing seed on the host, copies the private hawkBit
credential into a service-specific root-owned directory, writes the exact runtime
configuration and installs a hardened systemd unit. The service binds only to the
private Docker host-gateway address used by the edge. nginx exposes only the exact
`/v1/publishers/{publisher-id}/releases` route through the trusted HTTPS edge.
Signing material, hawkBit credentials, registrations, request state and audit stay
outside executable releases. The configuration and data roots grant the service
group traverse-only access; its readable and writable permissions stop at the
dedicated publisher configuration, secret and data paths.
Before every service start, a root-only systemd preparation step resolves
hawkBit's current address on the internal Compose network and atomically refreshes
the gateway configuration. Server upgrade and rollback restart the gateway after
container recreation, so no Management API port is published on the host.
The installer sets hawkBit's artifact and multipart limits to 512 MB and 513 MB,
matching the bounded gateway request contract, and recreates hawkBit only when
those settings first change. hawkBit independently enforces a 512 MiB artifact
limit and a 2 GiB tenant artifact-storage quota. Its upload staging tmpfs is
bounded to 768 MB so one maximum-size artifact can be processed without using the
container root filesystem.

The public web runtime serves a stored server-signed release document only at
`/manifests/PROJECT_KEY/RELEASE_ID`. It first resolves an exact public repository
publication and verifies the persisted signed payload digest. Private, unknown or
mismatched releases return no document. Signed artifact URLs continue to use the
digest-bound `/downloads/PROJECT_KEY/RELEASE_ID/SHA256` route.

Install or refresh the repository panel after FDUpdater is configured with the
managed `fdupdate-server-host/fdupdate-server/bundle` target. COT must already
serve its authenticated application API on a literal loopback IP. Place the
FDUpdate application credential in a root-owned regular file with mode `0400` or
`0600`; pass its path, never its value, to the deployment CLI:

```bash
cargo build --release --locked -p fdupdate-web
sudo ./server/deploy/fdupdate-server install-web \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server \
  --web-binary "$PWD/target/release/fdupdate-web" \
  --fdupdater-config /etc/fdupdater/FDUpdater.json \
  --cot-service-endpoint http://127.0.0.1:8080/ \
  --cot-service-credential-file /etc/cot/fdupdate-service-credential
```

The installer validates the loopback endpoint and exact managed target, then
copies the reader and operator credentials into the root-owned web secret area.
It also validates the COT credential as one bounded visible-ASCII token and
copies it atomically into that protected area. `web.json` contains only the
literal endpoint and protected destination path, never the credential. Missing,
partial, non-loopback, query/fragment-bearing, symlinked, empty, over-broad or
unreadable COT input stops before service activation. Re-running `install-web`
revalidates and refreshes the same protected binding before restarting the web
service; infrastructure upgrade and rollback retain the configuration/secret
roots outside executable releases.

The web portal and public device gateway run as distinct `fdupdate-web` and
`fdupdate-device-gateway` users with dedicated primary groups and secret trees.
Only both users' membership in `fdupdate-account-authority` is shared. The web
runtime owns `data/web` (`2750`); the Installation Account document is
`fdupdate-web:fdupdate-account-authority` mode `0640`, while administrator and
self-service documents remain web-only mode `0600`. The separately provisioned
`data/account-authority/installation-accounts.lock` is
`root:fdupdate-account-authority` mode `0660` inside a non-writable directory.
This lets the gateway hold a shared lock and read the current account document
during delegated enrollment, but not create, replace or remove web state. Web
administrator, COT, FDUpdater and copied device-operator credentials remain in
`web-secrets`, which the device identity cannot traverse or read. Re-running
either installer reasserts these owners and modes; executable upgrade and
rollback retain the separated data/configuration roots.

Two non-secret data groups remain separate from account authority:
`fdupdate-repository-runtime` permits only publisher and web to replace repository
registry documents, while `fdupdate-release-readers` permits web and device to
read publisher release state/artifacts. Neither group grants access to publisher,
web or device secret directories, and the device systemd namespace exposes the
release store read-only.

When migrating an installation created before these identities were separated,
run `install-web` first and immediately refresh `install-device-gateway` with the
reviewed current binary/products input. The web step moves the durable files to
their new owner and fails delegated enrollment closed until the device unit is
refreshed. The device installer refuses an old-owner web directory instead of
silently breaking the running web service. Fresh installations may install the
device gateway first; it prepares an empty protected web directory and the web
installer then creates the account document.

The panel service can read those copies but cannot write FDUpdater state or run
deployment commands. **Check for server updates** sends an exact-target `check`;
**Install server update** appears for a pending release and sends `apply`.
FDUpdater retains download, signature verification, caching, activation, health
checking and rollback authority.

## Upgrade and rollback

An infrastructure release carries
`FDUPDATE_SCHEMA_COMPATIBILITY=hawkbit-1.1.0-mariadb-v1`. Upgrade and rollback
stop before switching versions when this value differs. Database-changing upgrades
require the consistent backup/restore and migration procedure owned by FDU-023.

For a compatible candidate checkout:

```bash
sudo ./server/deploy/fdupdate-server upgrade \
  --release-id candidate-2 \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server
```

The CLI validates and copies the candidate, atomically switches `current`, waits
for health, and records `previous`. If startup fails, it atomically restores the
old configuration and waits for the old services to become healthy. An explicit
compatible rollback uses:

```bash
sudo ./server/deploy/fdupdate-server rollback \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server
```

Inspect current container state without changing it:

```bash
sudo ./server/deploy/fdupdate-server status \
  --install-root /opt/fdupdate-server \
  --config-root /etc/fdupdate-server \
  --data-root /var/lib/fdupdate-server
```

## Public site activation and rollback

The edge mounts the stable read-only `DATA_ROOT/site` directory and resolves its
atomic `current` pointer inside the container. Build a deterministic site package,
then activate it through the HTTPS origin that users reach:

```bash
node scripts/package-public-site.mjs
sudo /opt/fdupdate-server/current/fdupdate-site activate \
  dist/site-package/fdupdate-site-VERSION-REVISION.tar \
  /var/lib/fdupdate-server \
  https://update.example.com
```

For a private CA, pass its PEM file as the final argument. The helper verifies the
package and its file manifest before promotion, switches `current` atomically,
then downloads `/site-manifest.sha256` with caches disabled and compares it byte
for byte. A mismatch or unavailable edge restores and verifies the prior pointer.
Only a successful verification advances `previous`.

Rollback uses the same live identity check and failure recovery:

```bash
sudo /opt/fdupdate-server/current/fdupdate-site rollback \
  /var/lib/fdupdate-server \
  https://update.example.com
```

The stable parent mount is required. After upgrading from a release that mounted
`site/current` directly, recreate the edge once with the new Compose definition;
later site promotions do not require container recreation.

Local repository checks use Node.js and do not run in GitHub Actions:

```bash
node server/deploy/validate.mjs
node --test server/deploy/tests/deployment.test.mjs
bash server/deploy/tests/site-lifecycle.sh
```

On a clean dedicated Linux verification host, the complete disposable acceptance
path runs with one command:

```bash
sudo ./server/deploy/tests/host-acceptance.sh
```

It refuses to run when an `fdupdate-server` Compose project already exists. It
uses a uniquely generated `/var/tmp/fdupdate-acceptance.*` root, verifies native
atomic symlink transitions, clean deployment, TLS/mTLS denial boundaries, healthy
upgrade, explicit rollback and automatic recovery from an invalid nginx upgrade.
Its trap removes only that guarded root and its Compose containers, networks and
volumes. Digest-pinned image layers remain in the host cache for audit or the
later production installation.

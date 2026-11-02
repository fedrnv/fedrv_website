# Manual site updates

The **Update website** workflow builds the selected `main` revision and publishes `dist/` to a configured Linux VPS over SSH. Its only trigger is `workflow_dispatch`. Commits, pushes, pull requests, schedules and other workflows do not start it. It does not run acceptance/product tests, allocate versions or retain GitHub build artifacts.

Workflow: `.github/workflows/update-site.yml`. Publisher: `scripts/deploy/publish.mjs` and `scripts/deploy/remote.sh`. FDWEB-021 owns this implementation; FDWEB-012 owns actual server/TLS setup and staging/production qualification.

## One-time target configuration

Use an existing Linux web server and an SSH account permitted to write a dedicated deployment directory. The account needs Bash, GNU tar/coreutils (`mv -T`, `sha256sum`, `find`, `ln`, `chmod`) and SFTP for OpenSSH scp. Provision a real directory such as `/srv/fedrv` and configure the web server to serve **`/srv/fedrv/current`**, including `index.html`, extensionless project routes, static assets and the custom 404. Configure DNS, canonical redirects and HTTPS separately under FDWEB-012. The workflow does not change those settings or replace an existing real `current` directory.

In **Settings → Environments → production**, add these Variables (repository-level Variables also work):

| Variable | Value |
| --- | --- |
| `DEPLOY_HOST` | VPS DNS name or IPv4 address, without `ssh://` or a port |
| `DEPLOY_USER` | SSH user owning the deployment directory |
| `DEPLOY_PORT` | Optional SSH port; blank means `22` |
| `DEPLOY_ROOT` | Existing absolute deployment directory, for example `/srv/fedrv`; no spaces/dot segments |
| `DEPLOY_URL` | Public HTTPS origin serving this site, for example `https://fedrv.de` |

Add these **Secrets** to the same environment (or repository):

| Secret | Value |
| --- | --- |
| `DEPLOY_SSH_KEY` | Dedicated deployment SSH private key, without a passphrase; authorize its public key for the target account |
| `DEPLOY_KNOWN_HOSTS` | Verified OpenSSH known_hosts entry for this host and port |

Obtain the host key through a trusted VPS console or compare its fingerprint there before saving an `ssh-keyscan` result. For a nonstandard port the entry uses `[host]:port`. The publisher always uses strict host verification; it never trusts a host key fetched during deployment. No credential value belongs in source control or workflow inputs.

## Run an update

1. Complete the task's local checks, commit and push its source to `main`.
2. Open **Actions → Update website → Run workflow**, choose **main**, then click **Run workflow**.
3. Inspect the run's publication result. Other branches are skipped; only `main` can publish.

With GitHub CLI installed, the equivalent explicit manual command is:

```sh
gh workflow run update-site.yml --ref main
gh run list --workflow update-site.yml --limit 5
gh run watch <run-id>
```

The command graph is: pinned official checkout/setup-node actions → pinned npm install → locked dependency install → `astro build` → package/SSH publication → public package-marker check. `build` is `astro build` with no pre/post test hooks. SSH secrets are available only to the final publication step. Token permission is `contents: read`; checkout does not persist the token. Workflow concurrency queues updates rather than cancelling an active publication.

## Release layout and recovery

```text
DEPLOY_ROOT/
  current -> releases/<commit>-<run-id>-<attempt>
  releases/                  # current and prior immutable static releases
  incoming/                  # per-run uploads; failed ones remain inspectable
  .deploy-state/             # previous-pointer receipt for each activation
  .publish-lock/             # exists only while activation/recovery owns the lock
```

The runner validates static filenames/types, adds `deployment.json`, creates a tarball and computes SHA-256. The VPS verifies that digest and rejects traversal, links and incomplete packages before touching `current`. Extraction stays in the incoming directory. The completed release moves under `releases/`, its previous pointer is recorded, and a temporary relative symlink is atomically renamed to `current`.

The runner checks only that the public `deployment.json` identifies the expected commit/release (bounded retries, HTTPS, no redirects). This is publication integrity, not a product test suite. Configure the web server/CDN to serve that marker without stale caching. On a mismatch or an uncertain activation reply, the runner requests recovery. Recovery restores the recorded prior pointer only if this run still owns `current`; it refuses to overwrite a newer release. On a first deployment with no previous site, recovery removes only this run's pointer. The failed release remains available for inspection.

A failed build or upload cannot activate a release. If SSH is unavailable during recovery, the workflow reports that recovery could not be confirmed; inspect the VPS before another run. A stale `.publish-lock` fails closed: check that no publisher is active before removing that **empty lock directory**. Successful uploads are cleaned; earlier releases and failed incoming directories are not automatically deleted. Retain the current release and the previous release needed for rollback when performing owner-approved maintenance.

To roll back an activation manually, use a trusted local SSH configuration with the same verified host key and send the reviewed helper from the repository:

```sh
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -p 22 deploy@your-vps \
  'bash -s -- rollback /srv/fedrv <commit>-<run-id>-<attempt>' < scripts/deploy/remote.sh
```

Replace the example host/user/root/port and release ID with the actual target and the activation being reverted. The helper performs the same lock, ownership and previous-release checks. It does not delete releases or modify another deployment's pointer.

## Local verification

```sh
npm run build
npm run verify:deployment
git diff --check
```

`verify:deployment` parses workflow YAML, checks the complete allowed command graph and exercises the actual publisher and remote helper with a substituted network boundary, real tar archives and real filesystem links. It covers unsafe config, upload/checksum/archive failures, marker mismatch, lost activation acknowledgement, lock contention, stale rollback and successful recovery. On Windows install Git for Windows; the default test Bash is `C:/Program Files/Git/bin/bash.exe` (override with `FDWEB_BASH` if needed). Tests create and remove only owned `.local/` fixtures and temporary key files. They never contact a VPS. Linux SSH/SFTP, HTTPS, DNS and the actual target must still be qualified through FDWEB-012 before claiming production acceptance.

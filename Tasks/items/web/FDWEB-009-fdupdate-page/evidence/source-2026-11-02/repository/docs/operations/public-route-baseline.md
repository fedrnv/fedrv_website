# update.fedrv.de public route baseline

Observed read-only on 2026-10-18 before public-site deployment:

- DNS A resolves to `87.106.81.68`; no AAAA or CNAME was observed.
- HTTPS certificate validation succeeds through the public edge and the server
  identifies as nginx.
- `HEAD /` and `/healthz` return 200 with `no-store` behavior.
- `/docs`, `/admin`, and `/v1/operator/installations` return 401. The current
  root is the existing FDUpdate web surface; a public docs route does not exist.
- SSH service inspection was unavailable because this execution environment had
  no accepted public-key identity. No claim about live process names or private
  listeners is inferred. Version-controlled deployment configuration remains the
  reproducible topology source and keeps hawkBit/MariaDB private.

`node scripts/audit-public-routes.mjs` repeats bounded DNS/HTTPS observations and
checks that every existing deployment route is represented. It emits redacted
JSON and fails if public health or administration protection changes.

The coexistence policy sends `/`, `/docs`, `/docs/*`, and `/assets/site/*` to the
static site. Existing publisher, enrollment, application, artifact, repository,
download, share, manifest and `/admin` paths retain their upstream and security
semantics. Unknown paths and diagnostics fail closed. `node
scripts/test-site-routing.mjs` exercises the policy against isolated real HTTP
upstreams. Deployment promotes only after health and the complete matrix pass;
rollback restores the previous nginx config symlink and reloads nginx only after
`nginx -t` succeeds.

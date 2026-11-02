# Release retention

`fdupdate-retention` stores the server-wide stable and prerelease retention policy and the release cleanup journal in one atomically replaced JSON catalog. Both channel limits default to 10 and accept values from 1 through 1000.

Retention is evaluated independently for each publisher, product, component, platform and architecture. The immutable server publication time orders releases within each stable or prerelease channel. Assignment, rollout, validation-stand, rollback-window and recovery-window pins keep an otherwise expired release and are reported by the cleanup result.

Cleanup first persists the selected release as unavailable with `cleanup_pending`. It then asks the artifact backend to make the complete release unavailable and confirm that all release-owned bytes are absent. A confirmed cleanup is finalized with an immutable tombstone containing cleanup time and reason plus the manifest and artifact digests and sizes. If deletion or final persistence fails, the pending record remains unavailable and the next run retries safely. Completed tombstones are excluded from later runs.

The backend implementation must make `remove_release` idempotent and must remove a release as one logical unit. Operators should inspect reported pins and tombstones through the inventory panel before changing recovery policy.

## Running server worker

The GitHub publisher gateway owns cleanup transitions. Every accepted repository publication is added to `retention-catalog.json` before the API returns, then a worker runs at startup, after publication and every configured interval. The authenticated web panel may update only the two retention counts. Both processes serialize catalog mutations with the catalog lock and reject stale writes; cleanup holds the lock through its backend deletion and journal transitions. Deployment values seed a new catalog and never overwrite a later web-panel choice after restart. The deployed defaults are 10 stable versions, 10 prerelease versions, a batch of 10 cleanup candidates and a 3600-second interval. Missed timer ticks are skipped, so runs never overlap. `GET /retention/status` on the private publisher address reports only run, failure, removal and byte counters; it never returns hawkBit credentials or repository secrets.

Before each run the worker reads the durable device-gateway state and refreshes `active_assignment`, `rollback_window` and `recovery_window` pins. Missing or invalid device state aborts that run without changing availability. A failed cleanup remains `cleanup_pending` and is retried on the next run or process restart.

Each new publication durably records its repository-scoped hawkBit distribution-set and software-module IDs before publication commit. Cleanup first commits `available=false` to the catalog. Web and device delivery reopen that catalog before opening release bytes, so requests begun after the transition fail closed. The worker then deletes the private hawkBit objects, atomically moves the repository release directory out of `releases`, removes its bytes and records the tombstone. DELETE accepts hawkBit `404` as an idempotent retry result, is limited to ten seconds per request, and never derives a path outside `repositories/<project>/releases/<release>`.

At startup the publisher reconciles its immutable publication journal with storage. Releases created before the hawkBit cleanup journal existed receive an explicit `recovery_window` pin. They remain downloadable and visible but are never automatically reclaimed because their upstream identity cannot be proven. Operators must migrate or retire those releases through a separately accepted recovery procedure rather than deleting the pin manually.

# FDUpdate unified release distribution and updater fleet — planned FDTasks D009

GitHub is source-only. No GitHub Releases. All public SDK, desktop/service and private server release packages are published to FDUpdate Server with immutable signed manifests and release/prerelease channels. Manual-trigger CI upload only.

Proposed tasks (pending registration): FDU-130 release API and trust contract; FDU-131 public/private artifact publication and download; FDU-132 lightweight application-controlled update SDK; FDU-133 unique authenticated managed FDUpdater enrollment and heartbeat; FDU-134 explicit updater-to-application inventory, version, check/update scope and ownership; FDU-135 administrator fleet dashboard with last seen, status, managed applications, last check, errors; FDU-136 integration gate; FDU-137 independent review.

Client libraries are not independent executable update targets when statically linked: host app rebuilds/updates or implements an explicit ABI-safe module mechanism. User-controlled COT Service/Tunnel self-update without full FDUpdater. Proprietary COT Server uses managed FDUpdater with drain, health check and rollback.

Security: authenticated updater identity, scoped app ownership, stale/offline not equal failure, revoke/replay resistance, signatures and hashes, bounded retries, resumable downloads, no unexpected update on offline, public downloads rate-limited, private packages authorized. Preserve D006 installation inventory and avoid duplicate tasks. No billing or production deployment. Register next FDTasks development Epic with one gate and one independent review after checking IDs and existing accepted tasks.

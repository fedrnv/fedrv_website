# FDOS updater baseline inventory

This inventory covers the immutable snapshot in `legacy/fdos-updater/`. The source
is `fedrnv/FDOS` commit `1013672a9d667b4b65b8205dd455d67fc18d6152`.
The snapshot contains 53 source-derived files plus the FDUpdate-owned
`MIGRATION.md` provenance note. Each source-derived Git blob matches that commit.

## Reproduction

The imported directory is intentionally not a complete Cargo workspace. Its root
manifest still names `scripts/xtask`, which was not imported, so invoking Cargo
against `legacy/fdos-updater/Cargo.toml` fails while loading the workspace. Do not
repair that historical snapshot.

Use a detached checkout of the exact source commit to verify both the imported
blobs and the applicable updater/distribution tests:

```text
git clone --filter=blob:none --no-checkout https://github.com/fedrnv/FDOS.git ../FDOS-baseline
git -C ../FDOS-baseline checkout --detach 1013672a9d667b4b65b8205dd455d67fc18d6152
node scripts/verify-fdos-baseline.mjs --source ../FDOS-baseline
```

The command requires Git, Node.js, rustup and toolchain `1.98.0`. It first compares
all 53 source-derived blobs, then runs this locked package set on the full source
checkout: `fdos-release-format`, `fdos-install-layout`, `fdos-updater`,
`fdos-release-publisher` and `fdos-release-store`, including all targets. Use
`--integrity-only` when only the import check is required.

## Source-to-target disposition

| Imported surface | What it proves | FDUpdate disposition | Owner task(s) |
| --- | --- | --- | --- |
| `Cargo.toml`, `Cargo.lock`, `rust-toolchain.toml` | Original workspace versions and dependency closure | Evidence only. Create a smaller product-neutral active workspace and a new lockfile; do not inherit absent FDOS members. | FDU-003 |
| `packages/release-format/**` | Bounded signed manifest, artifact identity, rollout, replay, downgrade and exact rollback rules | Extract security invariants into `fdupdate-contract`; replace the closed `Server/Agent/Updater` enum with registered product/component identifiers and retain a versioned FDOS decoder. Signing helpers stay outside runtime crates. | FDU-002, FDU-006, FDU-011, FDU-030 |
| `packages/install-layout/**` | Checked absolute paths, OS lock, immutable hash slots and atomic current/previous pointers | Reuse behavior in the generic installation/transaction layer. Bind every path to a registered installation root and preserve previous-slot recovery. | FDU-003, FDU-004, FDU-007 |
| `packages/service-runtime/**` | Validated service names, bounded shutdown and Windows service dispatch | Move generic primitives into lifecycle/bootstrap crates; add systemd and Windows adapters without product names. | FDU-003, FDU-008, FDU-009, FDU-012 |
| `packages/common/**` | Redacting `Secret` wrapper | Extract the wrapper only if required by the new configuration/audit APIs. The FDOS crate and its otherwise unused updater dependency are obsolete. | FDU-003, FDU-010 |
| `packages/task-model/src/lib.rs`, `project_policy.rs` | Canonical UUID parsing and native absolute-path rejection currently used by updater/layout | Replace these narrow dependencies with FDUpdater-owned identity/path types. Do not import the FDOS task domain. | FDU-003, FDU-004 |
| `packages/task-model/src/build_report.rs` | Trusted build-stage receipt consumed by the offline publisher | Define a release-ingestion receipt on the server/publication boundary; it is not a client-core type. | FDU-019 |
| `packages/task-model/src/cockpit.rs`, `conversation.rs`, `local_operations.rs`, `tests/local_operations.rs` | FDOS task cockpit, conversations and local coding operations | Obsolete for FDUpdater and FDUpdate Server. Preserve only as evidence; no migration. | None |
| `apps/updater/src/engine.rs` | Transaction phases, replay cursor, apply/rollback, health rollback, recovery and self-handover orchestration | Split into product-neutral core, transaction/recovery and bootstrap modules. Retain fail-closed transitions and remove the fixed component enum. | FDU-003, FDU-006, FDU-007, FDU-008, FDU-009 |
| `apps/updater/src/config.rs`, `control.rs` | Strict config, bounded health command and native service control | Replace FDOS component/service assumptions with explicit target registration and lifecycle adapters. Remote metadata must never supply commands or service authority. | FDU-004, FDU-008, FDU-027, FDU-028 |
| `apps/updater/src/network.rs` | Pinned/public TLS, disabled proxy/redirect behavior, bounded streaming and artifact verification | Reuse as the manifest distribution provider and make hawkBit a separate provider producing the same normalized intent. | FDU-005, FDU-006 |
| `apps/updater/src/cli.rs`, `main.rs`, `lib.rs` | Bootstrap/status/check/apply/pause/resume/rollback/recover/run command behavior | Rebuild as `FDUpdater` CLI/service plus authorized local API and audit. Retain command equivalence and bounded polling; add readiness, supervision, diagnostics and per-target channels. | FDU-003, FDU-010, FDU-027, FDU-028, FDU-029, FDU-030 |
| `apps/updater/tests/https.rs` | Real loopback TLS, signature, corruption, redirect, size and timeout checks | Port as provider/security integration coverage with generic fixture products. | FDU-005, FDU-006 |
| `apps/updater/examples/**` | Native component, release server, certificate and distribution fixtures | Generalize into reusable test fixtures. Never ship fixture keys or synthetic trust as production configuration. | FDU-003, FDU-006, FDU-008, FDU-009, FDU-013 |
| `apps/release-publisher/**` | Offline plan validation, domain-separated signing, immutable atomic publication and bounded framed transport | Keep out of FDUpdater. Adapt relevant receipt/signing/publication behavior to FDUpdate Server ingestion; hawkBit replaces the FDOS manifest store as the primary server. | FDU-019, FDU-020, FDU-021 |
| `apps/release-store/**` | Bounded HTTPS serving, immutable paths, cache policy and lifecycle | Compatibility/reference only. Do not make it a second production server beside hawkBit; retain only fixtures or migration serving if an accepted task requires them. | FDU-005, FDU-011, FDU-017 |
| `deploy/linux/component-service.py`, `deploy/windows/component-service.ps1` | Native identities, permissions, service receipts, install/repair/uninstall and stable host layout | Rewrite as FDUpdater packages/installers while preserving distinct identities, receipt-bound authority and retained application/recovery data. | FDU-008, FDU-009, FDU-012 |
| `scripts/updater-native.cjs` | Native service, self-update, isolation and recovery acceptance orchestration | Port scenarios to the canonical FDUpdater CLI gate and generic fixture products. | FDU-009, FDU-012, FDU-014 |
| `scripts/updater-disk-exhaustion.cjs` | Bounded-volume activation and recovery behavior | Port to transactional recovery coverage. | FDU-007, FDU-014 |
| `scripts/release-ci.cjs` | Manual-only workflow and release evidence validation | Adapt to FDUpdate build/release gates; retain the `workflow_dispatch`-only invariant. | FDU-012, FDU-014, FDU-019 |
| `docs/updater.md`, `docs/updatable-services.md` | Historical CLI, layouts, identities, recovery and runbooks | Rewrite for product-neutral names and link the original behavior as migration evidence. | FDU-010, FDU-011, FDU-012 |
| `Tasks/decisions/ADR-0019*.md`, `ADR-0020*.md`, `ADR-0021*.md` | Accepted security, recovery and publication decisions | Preserve unchanged. New ADRs may generalize names but may not weaken signatures, isolation, atomicity or manual publication controls. | FDU-002, FDU-006, FDU-007, FDU-009, FDU-012, FDU-019 |
| `Tasks/items/operations/FDOS-021*/TASK.md`, `FDOS-022*/TASK.md`, `MIGRATION.md` | Historical requirements and provenance | Evidence only; never treated as current FDUpdate completion evidence. | FDU-001 |

## FDOS coupling that must not enter the generic core

- The public contract has a closed `Component::{Server, Agent, Updater}` enum,
  FDOS-prefixed binary/service names, `/opt/fdos` examples and a `/fdos` release
  URL prefix.
- One config owns one root and at most one target of each fixed component. The new
  registry must support unrelated products, multiple independently versioned
  components and non-overlapping validated roots.
- CLI parsing, artifact filenames, release publication plans and service scripts
  derive authority from the fixed component enum. New remote metadata may identify
  a registered target but cannot add a local path, command or service name.
- Updater readiness is a host nonce/process record. Application update readiness,
  quiescence, watchdog restart budgets and incident reporting are new contracts;
  they cannot be inferred from the historical health command.
- Historical semantic versions and the FDOS manifest cursor are compatibility
  inputs. Release/prerelease policy becomes persisted per-target state and cannot
  permit an implicit downgrade.

## Invariants retained by migration

- Ed25519 signatures remain domain-separated and cover exact manifest/artifact
  identity; invalid signatures, hashes, replay, expiry, downgrade and incompatible
  updater versions fail closed.
- Downloads, JSON, logs, commands, retries, health checks and recovery are bounded.
  HTTPS redirects and ambient proxies remain disabled where they could change the
  authenticated endpoint.
- Executables remain immutable hash-addressed slots with atomic current/previous
  pointers, an OS-held mutation lock and a durable recovery journal.
- Configuration, credentials, application data and workspaces remain outside
  executable slots. Only receipt-bound targets inside validated installation roots
  can be stopped or mutated.
- Self-update keeps a stable bootstrap, fresh readiness proof, bounded handover and
  local restoration of the previous updater without depending on an application or
  update server.
- Runtime services never receive release signing keys. Publication stays manually
  initiated and published artifacts remain immutable.

## Verification boundary

The reproduced package suite proves the portable Windows behavior exercised by
the selected Rust tests and loopback TLS fixtures. It does not prove Linux native
service behavior, reboot survival, production identities, real systemd/polkit,
hosted publication or production signing. Those checks remain assigned to their
implementation tasks and the Epic full gate. The historical Node native scripts
were inventoried but were not executed as FDU-001 acceptance because they mutate
native services and require task-specific fixtures and privileges.

---
schema: fdtasks-spec/v4
id: FDWEB-015
title: "Make foundation browser verification report recoverable results"
type: Bug
area: quality
component: browser-verification
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Restore trustworthy foundation browser verification across successful runs, startup failure and browser termination."],"packets":["Repair and verify the browser harness with its required append-only gate wiring"],"independent_acceptance":false,"boundary_reason":"A browser result is acceptable only when its process lifecycle, owned cleanup and correction membership are recorded without hiding failures."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-006"]
created_at: 2026-11-02T14:47:00Z
created_by: "Codex under the owner's continuous development request"
---

# FDWEB-015 — Foundation browser verification lifecycle

## Goal

Report the original browser verification result and clean up only owned resources when Chromium starts, exits, or fails to start.

## Inputs and source baseline

Source baseline: `4b279027e60adb7f4669e28ad299f5c6ba8fb0d0` plus the hash-bound D001 candidate in FDWEB-006 evidence. Governing policy: FDTasks 5.6 with SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.

During FDWEB-007 the clean snapshot and content tests passed, while browser commands failed with `taskkill.exe ...` status 128 in the harness finally block. A terminated or never-created child must not trigger an invalid kill that replaces the original error.

## Scope

Repair process liveness and shutdown in `scripts/browser.mjs`; add direct lifecycle checks; document bounded execution. Record D001 membership and gate dependency through events. Teach the existing local ledger checker to consume those specific append-only membership/dependency records so it can verify this correction's integration without rewriting accepted specifications.

## Boundaries and compatibility

No visitor-facing changes, deployment, credential access or normative policy edits. Keep prior specifications/evidence immutable. Kill only a process owned by this invocation. Cleanup only the exact disposable profile created by this invocation.

## Failure and recovery

Missing executables and early browser exits fail with their original diagnostic. Browser assertions remain failures. Cleanup failures are reported alongside the original result. Run browser checks sequentially after bounded clean/content checks to avoid unnecessary host load.

## Ordered implementation

1. Record the blocked gate and append-only correction topology.
2. Repair browser startup/shutdown, and exercise missing-executable and callback failure scenarios.
3. Run the affected real-browser navigation/accessibility/responsive checks and record a durable handoff back to FDWEB-007.

## Readiness, impact and acceptance matrix

Risk: medium; local process lifecycle and gate evidence. Affected paths: `scripts/browser.mjs`, lifecycle verification script, `package.json`, `docs/verification.md`, `Tasks/tools/verify-ledger.mjs` and correction/gate/Epic events. No UI, user data or production effect. No dependency on the gate itself, avoiding a dependency cycle.

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Missing browser and callback failures retain their original diagnostics; successful shutdown removes the owned profile. | Runtime contract | `npm run verify:browser-lifecycle` | Local Chromium and deliberately nonexistent executable | Expected errors asserted; normal lifecycle passes; no invalid PID kill masks a result. |
| AC-02 | Foundation browser checks and append-only correction topology validate. | Direct integration | `npm run verify:home`, `npm run verify:accessibility`, `npm run verify:browser`; `node Tasks/tools/verify-ledger.mjs` | Current static preview; 360/1440px | All checks pass after the lifecycle repair; gate depends on this correction and Epic membership resolves from events. |

## Completion evidence and cleanup

Record candidate/policy hashes, initial failure, exact commands and outcomes, remaining limits and the FDWEB-007 resumption checkpoint. Preserve existing passing build/content evidence when its source identity is unchanged.

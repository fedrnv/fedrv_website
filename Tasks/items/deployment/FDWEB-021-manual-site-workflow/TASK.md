---
schema: fdtasks-spec/v4
id: FDWEB-021
title: "Publish a manually dispatched static-site update workflow"
type: Task
area: deployment
component: manual-site-publication
epic_id: FDWEB-EPIC-D002
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Provide an owner-invoked GitHub Actions workflow that builds repository source and safely updates a configured SSH static-site target."],"packets":["One cohesive workflow, publisher, local verification and documentation packet"],"independent_acceptance":false,"boundary_reason":"A usable site-update workflow requires its build, publication and recovery contract together; target provisioning remains in FDWEB-012."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-002"]
created_at: 2026-11-02T19:20:00Z
created_by: "Owner request and Codex"
---

# FDWEB-021 — Manual site-update workflow

## Goal

Build the current repository's static site and publish it to an explicitly configured SSH target only when the owner runs the workflow manually.

## Inputs and source baseline

Owner requested a new task and its implementation on 2026-11-02, with manual-only workflow invocation. Base source is the current clean `main`; the readiness event binds its exact revision. Policy: FDTasks 5.6, SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`. Existing deployment owner FDWEB-012 retains VPS/web-server/TLS/staging/production qualification.

## Scope

Add one workflow_dispatch-only workflow, immutable action pins, the documented Node/npm build, a parameterized SSH publisher with strict host verification, checksum-bound release upload, atomic activation, recoverable prior release and bounded publication-integrity check. Add local CLI checks and real disposable filesystem failure/recovery scenarios. Document GitHub Variables/Secrets, target prerequisites, manual invocation and rollback. Commit and push the completed task as requested by the owner.

Allowed paths: `.github/workflows/`, `scripts/deploy/`, focused local verification scripts, `package.json`, `.gitattributes`, deployment documentation, README/DEVELOPMENT command documentation and append-only task/Epic records.

## Boundaries and compatibility

No automatic workflow triggers, hosted acceptance/product test stages, retained GitHub build artifacts, credential values, DNS/web-server changes or live workflow dispatch. Preserve static output and product icons. SSH configuration is supplied through repository Variables and Secrets; an unconfigured target fails closed. Actual production delivery and HTTPS acceptance remain FDWEB-012.

## Failure and recovery

Failed build/upload/checksum/extraction leaves the active release unchanged. Failed publication-integrity verification restores the previous release when this run still owns the current pointer. Keep earlier releases recoverable; do not force-push or delete another publisher's files. A failed SSH connection with an uncertain activation reports failure and uses bounded ownership-checked recovery, never claims a successful deployment.

## Ordered implementation

1. Record new Epic membership and the handoff from FDWEB-012 without changing accepted specifications.
2. Implement workflow and bounded publisher; document setup and manual commands.
3. Run local syntax/policy/build and publication failure/recovery checks, inspect the reachable workflow command graph, record evidence, commit and push.

## Readiness, impact and acceptance matrix

Risk: medium for this local workflow implementation; running it later can affect public availability and requires owner-supplied target/credentials. No visitor UI, backend or user-data changes. One implementation workspace; no live deployment in this task.

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Only workflow_dispatch invokes publication; minimum read token, pinned actions and secret names only; hosted command graph contains build/publication but no task tests. | Local workflow policy | `npm run verify:deployment` | Workflow/package/publisher source | Manual-only contract and bounded command graph pass. |
| AC-02 | Invalid config/archive/checksum fails without replacing the current release; activation and ownership-checked rollback preserve prior content. | Direct local publication tests | `npm run verify:deployment` | Disposable directories and real Bash/SSH command boundary fixtures | Positive/negative cases pass; original release remains recoverable. |
| AC-03 | Setup, manual invocation and recovery are documented and the verified implementation is committed/pushed. | Build/documentation/publication | `npm run build`; documented CLI review; `git push origin main` | Local static build and GitHub repository | Workflow is available in GitHub; missing production configuration is recorded honestly. |

## Completion evidence and cleanup

Bind evidence to source/policy/candidate hashes and exact commands; record Windows/Git Bash limits where applicable. Remove owned local fixtures and secret-bearing temporary files. Never claim a staging/production deployment without executing it on an authorized target.

---
schema: fdtasks-spec/v4
id: FDWEB-001
title: "Adopt FDTasks 5.6 and create the repository task ledger"
type: Correction
area: governance
component: task-lifecycle
epic_id: FDWEB-EPIC-S001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Establish FDTasks 5.6 as the canonical file-based task lifecycle for fedrv_website and represent all existing website backlog issues with immutable task and Epic specifications."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Establish FDTasks 5.6 as the canonical file-based task lifecycle for fedrv_website and represent all existing website backlog issues with immutable task and Epic specifications."}
initial_priority: P1
initial_status: Planned
initial_dependencies: []
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-001 — Adopt FDTasks 5.6 and create the repository task ledger

## Goal

Establish FDTasks 5.6 as the canonical file-based task lifecycle for fedrv_website and represent all existing website backlog issues with immutable task and Epic specifications.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Upstream FDOS policy file and adoption commit are recorded in Tasks/LIFECYCLE_VERSION_HISTORY.md.
- Existing issues #1–#10 were verified open before migration.

## Scope

Copy the normative generic FDTasks 5.6 policy from FDOS with exact provenance; create repository-specific task/development instructions, lifecycle metadata, templates and compatibility baseline; map the existing backlog to bounded task files and development Epics; retain GitHub Issues as discussion mirrors.

## Boundaries and compatibility

Do not copy FDOS-specific orchestration or product rules. Do not alter the SVG assets or website product scope. No prior website task records are migrated or rewritten. GitHub Issues remain discussion mirrors.

## Failure and recovery

If a source policy hash or task mapping cannot be verified, leave the adoption incomplete and record the exact discrepancy; do not claim compliance.

## Ordered implementation

1. Add the pinned generic policy, profile, lifecycle, templates and local repository rules.
2. Split the website plan into bounded D001 and D002 Epics with required gate/review tasks.
3. Create one canonical task file per existing implementation issue and link it back to that issue.
4. Validate paths, metadata, IDs, dependencies and JSON files; inspect the final Git tree.

## Readiness, impact and acceptance matrix

Risk: low; documentation-only governance change in a new repository with no legacy task records. Affected components and dependent callers: AGENTS.md, DEVELOPMENT.md and Tasks/**. UI/data/concurrency/compatibility/security impact: No product runtime, data or security boundary changes..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | The exact upstream FDTasks 5.6 specification and SHA-256 provenance are recorded. | Source integrity | sha256sum Tasks/tasks_file_structure_v5_6.md | Committed policy file | Digest equals the pinned source digest in lifecycle.json. |
| AC-02 | Root and Tasks-specific development rules, format entry point, project profile and compatibility baseline exist. | Repository structure | Inspect tracked paths and parse JSON metadata | Clean Git checkout | All required files are present and valid JSON; no FDOS product-specific orchestration was copied. |
| AC-03 | Issues #2–#10 each map to exactly one task file; D001 and D002 each include one gate and one independent review. | Backlog consistency | Compare issue links, task IDs and Epic memberships | Tasks/items and Tasks/epics | All mappings and dependencies resolve; no issue-only implementation task remains. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

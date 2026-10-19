---
schema: fdtasks-spec/v4
id: FDWEB-007
title: "Run the site-foundation integration gate"
type: Task
area: quality
component: epic-d001-gate
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Verify the D001 foundation candidate as one integrated static site before independent review."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Verify the D001 foundation candidate as one integrated static site before independent review."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-002","FDWEB-003","FDWEB-004","FDWEB-005","FDWEB-006"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-007 — Run the site-foundation integration gate

## Goal

Verify the D001 foundation candidate as one integrated static site before independent review.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.

## Scope

Run the D001 member tasks' declared local checks on one frozen candidate; inspect direct interactions among the shared shell, content collection, home page, project route and metadata; record source/policy hashes and results.

## Boundaries and compatibility

Do not expand to unrelated product or infrastructure areas and do not run task-acceptance suites in hosted CI.

## Failure and recovery

Any failure blocks the gate; correct through an in-scope correction task and rerun only affected checks.

## Ordered implementation

1. Freeze candidate and identify exact local commands from D001 members.
2. Run the diff-local build/content/UI checks.
3. Inspect generated routes and direct interactions; record evidence.

## Readiness, impact and acceptance matrix

Risk: medium; this gate validates integrated visitor-facing foundations. Affected components and dependent callers: D001 changed areas and direct interactions. UI/data/concurrency/compatibility/security impact: Includes generated page and responsive shell review; no production effect..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | All D001 member criteria are mapped to current passing local evidence. | Integration gate | Run member-declared local commands and inspect receipts | Frozen D001 candidate | Every included criterion has a current PASS or a blocking finding. |
| AC-02 | Home, project route, navigation, metadata and 404 operate together without broken internal links. | Direct integration check | Use local static preview and inspect routes | Built site | All required routes render and navigate as specified. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

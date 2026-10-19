---
schema: fdtasks-spec/v4
id: FDWEB-009
title: "Write the FDUpdate project page"
type: Task
area: web
component: fdupdate-page
epic_id: FDWEB-EPIC-D002
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Publish an accurate /update overview that explains FDUpdate and links to its separate portal."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Publish an accurate /update overview that explains FDUpdate and links to its separate portal."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-004"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-009 — Write the FDUpdate project page

## Goal

Publish an accurate /update overview that explains FDUpdate and links to its separate portal.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #6](https://github.com/fedrnv/fedrv_website/issues/6). This TASK.md defines the canonical scope.

## Scope

Describe purpose, users, update flow and verified benefits; add links to the portal, documentation, source or releases only when they exist; use project content model and real screenshots or a clear image placeholder.

## Boundaries and compatibility

Do not claim unfinished SaaS, mirror, encryption, billing or other roadmap features as shipped. Do not publish invalid external URLs.

## Failure and recovery

If a referenced capability or URL cannot be verified, omit it or identify it as planned.

## Ordered implementation

1. Verify content against the FDUpdate repository.
2. Author the structured project entry.
3. Build and inspect the page and all destinations.

## Readiness, impact and acceptance matrix

Risk: medium; public statements about product behavior and a portal link. Affected components and dependent callers: FDUpdate content entry and shared page template. UI/data/concurrency/compatibility/security impact: Informational page; no runtime integration with the portal..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Page describes current FDUpdate behavior and separates available features from plans. | Content verification | Compare page statements with current FDUpdate docs and code | FDUpdate repository main | Every feature claim is supported by current project evidence. |
| AC-02 | /update renders and its portal link points to the verified update.fedrv.de destination. | Navigation check | Open generated route and follow portal link | Static preview | The route loads and the destination is verified or omitted if unavailable. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

---
schema: fdtasks-spec/v4
id: FDWEB-010
title: "Write the COT project page"
type: Task
area: web
component: cot-page
epic_id: FDWEB-EPIC-D002
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Explain COT as a communication tool in language understandable to a prospective user."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Explain COT as a communication tool in language understandable to a prospective user."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-004"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-010 — Write the COT project page

## Goal

Explain COT as a communication tool in language understandable to a prospective user.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #7](https://github.com/fedrnv/fedrv_website/issues/7). This TASK.md defines the canonical scope.

## Scope

Describe COT purpose, supported channels and integrations according to current repository status, user scenarios, benefits and verified links; use real screenshots or diagrams.

## Boundaries and compatibility

Do not present planned providers or incomplete capabilities as available. Do not expose secrets or private operational data in screenshots.

## Failure and recovery

Remove or qualify unsupported claims and omit broken links; use the shared image fallback when visuals are unavailable.

## Ordered implementation

1. Verify current capabilities in COT repository documentation.
2. Write content and select safe public visuals.
3. Build and check page, links and responsive layout.

## Readiness, impact and acceptance matrix

Risk: medium; public claims and visuals for a changing product. Affected components and dependent callers: COT content entry and shared project page. UI/data/concurrency/compatibility/security impact: Informational page; no COT API calls..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Every described channel and function matches the current COT repository status. | Content verification | Compare copy with COT README/docs and task state | COT repository main | No planned function is described as released. |
| AC-02 | /cot shows purpose, benefits, verified links and responsive real visuals or an intentional fallback. | UI/navigation review | Inspect route at desktop and mobile widths | Static preview | The content is legible, images are safe, and links resolve. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

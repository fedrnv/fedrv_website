---
schema: fdtasks-spec/v4
id: FDWEB-005
title: "Build the FEDRV.DE home page"
type: Task
area: web
component: homepage
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Explain FEDRV and the FD (Fast Development) approach and guide visitors to FDUpdate, COT and FDStorage."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Explain FEDRV and the FD (Fast Development) approach and guide visitors to FDUpdate, COT and FDStorage."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-003","FDWEB-004"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-005 — Build the FEDRV.DE home page

## Goal

Explain FEDRV and the FD (Fast Development) approach and guide visitors to FDUpdate, COT and FDStorage.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #3](https://github.com/fedrnv/fedrv_website/issues/3). This TASK.md defines the canonical scope.

## Scope

Use the approved headline and refined positioning copy; introduce human-led AI-assisted development; show cards for the three initial products from the project content model; link to project pages and the FDUpdate portal when its URL is verified.

## Boundaries and compatibility

Do not claim every product is complete or that AI output is unreviewed. Do not show non-existent links, metrics, features or customer references.

## Failure and recovery

If a product has no verified external portal, link only to its local page; long copy remains readable at mobile widths.

## Ordered implementation

1. Structure the hero, approach section and product cards.
2. Bind cards to project content data.
3. Review text hierarchy and mobile layout.

## Readiness, impact and acceptance matrix

Risk: medium; this is the primary entry point and defines product positioning. Affected components and dependent callers: home route and project card collection. UI/data/concurrency/compatibility/security impact: Public informational page; no data collection..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | The page explains FEDRV, FD components and the human-guided AI development approach in plain Russian. | Editorial review | Review rendered home page | Desktop and mobile browser | A new visitor understands the purpose and audience without unsupported claims. |
| AC-02 | FDUpdate, COT and FDStorage cards link to their local pages and show accurate summaries. | Navigation check | Open each card and follow its link | Generated static pages | All three routes resolve and labels match their project pages. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

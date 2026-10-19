---
schema: fdtasks-spec/v4
id: FDWEB-003
title: "Define the FEDRV.DE design system and shared components"
type: Task
area: design
component: site-design-system
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Implement one restrained, responsive visual system for the home page and project pages."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Implement one restrained, responsive visual system for the home page and project pages."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-002"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-003 — Define the FEDRV.DE design system and shared components

## Goal

Implement one restrained, responsive visual system for the home page and project pages.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #4](https://github.com/fedrnv/fedrv_website/issues/4). This TASK.md defines the canonical scope.

## Scope

Define CSS design tokens for neutral backgrounds, blue/gray accents, typography, spacing and focus states; build shared header, footer, buttons, product cards, breadcrumbs and external-link blocks; define image-unavailable and planned-status presentation.

## Boundaries and compatibility

Preserve the COT-derived product icon geometry and colors. Avoid stock imagery, decorative gradients and unsupported product screenshots. No business logic or route changes.

## Failure and recovery

Missing images or long text must fall back gracefully without broken layout; keyboard focus remains visible.

## Ordered implementation

1. Translate the agreed visual direction into CSS variables and component states.
2. Apply the shared shell and reusable components to a sample page.
3. Inspect desktop and narrow viewport layouts and fix direct defects.

## Readiness, impact and acceptance matrix

Risk: medium; affects every visitor-facing page and keyboard interaction. Affected components and dependent callers: shared layout, tokens and reusable UI components. UI/data/concurrency/compatibility/security impact: Responsive visual and accessibility impact; no data or security impact..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Shared components use the approved neutral, blue and gray tokens and have consistent focus states. | Visual/keyboard inspection | Open sample page and navigate by keyboard | Desktop browser | Focus is visible and controls are visually consistent. |
| AC-02 | Layout works at 360 px and desktop widths without horizontal scrolling or clipped content. | Responsive UI | Inspect at 360 px and 1440 px | Browser viewport | Navigation, cards and text remain readable with no overflow. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

---
schema: fdtasks-spec/v4
id: FDWEB-006
title: "Add accessibility and search metadata"
type: Task
area: quality
component: seo-accessibility
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Ensure each initial site route is navigable, shareable and discoverable with correct metadata and basic accessibility."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Ensure each initial site route is navigable, shareable and discoverable with correct metadata and basic accessibility."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-003","FDWEB-004","FDWEB-005"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-006 — Add accessibility and search metadata

## Goal

Ensure each initial site route is navigable, shareable and discoverable with correct metadata and basic accessibility.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #10](https://github.com/fedrnv/fedrv_website/issues/10). This TASK.md defines the canonical scope.

## Scope

Add per-page title and description, canonical URL, Open Graph metadata, sitemap, robots file, favicon, semantic heading structure, alt-text support and a working 404 page; check internal routes and outbound links.

## Boundaries and compatibility

Do not add tracking scripts or collect visitor data. Do not assert accessibility certification or search ranking.

## Failure and recovery

Missing metadata is caught during build or a documented local check; unknown links are excluded until verified.

## Ordered implementation

1. Implement global and per-page metadata.
2. Add sitemap and robots outputs.
3. Review keyboard navigation, image alternatives, contrast and broken internal routes.

## Readiness, impact and acceptance matrix

Risk: low; metadata and navigation quality without user state. Affected components and dependent callers: page head, shared components and generated public files. UI/data/concurrency/compatibility/security impact: Accessibility and search presentation; no security boundary..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Each initial route has a unique title, description and canonical URL; sitemap and robots files are generated. | Rendered metadata inspection | Build and inspect generated head and public files | Home and sample project pages | Metadata is unique and outputs reference fedrv.de. |
| AC-02 | Keyboard navigation, heading order, image alternatives and internal links have no critical defects. | Manual local review | Follow the documented keyboard and link checklist | Desktop and mobile browser | All navigation is reachable, images have meaningful alternatives and routes resolve. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

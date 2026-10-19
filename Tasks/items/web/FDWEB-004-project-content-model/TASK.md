---
schema: fdtasks-spec/v4
id: FDWEB-004
title: "Create the product content model and shared project page"
type: Task
area: web
component: project-content
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Allow each project page and home-page card to be generated from one validated Markdown/MDX content record and a shared page template."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Allow each project page and home-page card to be generated from one validated Markdown/MDX content record and a shared page template."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-002"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-004 — Create the product content model and shared project page

## Goal

Allow each project page and home-page card to be generated from one validated Markdown/MDX content record and a shared page template.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #5](https://github.com/fedrnv/fedrv_website/issues/5). This TASK.md defines the canonical scope.

## Scope

Define the content schema for name, slug, summary, status, purpose, capabilities, benefits, documentation links, portal links and optional imagery; add a dynamic static route and card projection; permit optional fields to be absent without broken output.

## Boundaries and compatibility

Do not introduce a CMS, database, React or unvalidated remote content. Links and claims are supplied per project and must not be fabricated.

## Failure and recovery

Invalid required metadata fails the local build with a clear field-specific error; absent optional fields hide their section.

## Ordered implementation

1. Define the collection and validation schema.
2. Build a reusable route and card from the same content source.
3. Add a small fixture covering optional fields and verify generated HTML.

## Readiness, impact and acceptance matrix

Risk: medium; this is the content contract shared by product pages. Affected components and dependent callers: content schema, project route and home-page card component. UI/data/concurrency/compatibility/security impact: User-facing content only; no user data or backend..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | A valid Markdown entry generates a project route and a product card from the same data. | Static build | Run documented build command | Valid sample content entry | Both route and card render with the expected slug and title. |
| AC-02 | Invalid required fields fail the build; missing optional media or links render without empty sections. | Schema validation and route inspection | Run build with valid and invalid fixture entries | Content collection fixtures | Clear validation error for invalid input and clean output for optional omissions. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

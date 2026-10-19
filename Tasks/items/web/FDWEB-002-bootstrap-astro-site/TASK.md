---
schema: fdtasks-spec/v4
id: FDWEB-002
title: "Set up the Astro and TypeScript site foundation"
type: Task
area: web
component: site-bootstrap
epic_id: FDWEB-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Create a clean-buildable Astro + TypeScript static site foundation with documented local commands and route-ready shared layout."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Create a clean-buildable Astro + TypeScript static site foundation with documented local commands and route-ready shared layout."}
initial_priority: P1
initial_status: Planned
initial_dependencies: []
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-002 — Set up the Astro and TypeScript site foundation

## Goal

Create a clean-buildable Astro + TypeScript static site foundation with documented local commands and route-ready shared layout.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #2](https://github.com/fedrnv/fedrv_website/issues/2). This TASK.md defines the canonical scope.

## Scope

Initialize Astro with TypeScript and static output; set the canonical site URL; create a minimal shared layout, navigation, footer and 404 page; configure content collections for project pages; document the Node version policy, package manager and CLI commands.

## Boundaries and compatibility

No React, server-side rendering, database or live deployment. Keep the existing icons. Do not add product claims or project pages beyond fixtures needed to validate the content schema.

## Failure and recovery

A failed clean install or static build must be reproducible from documented CLI steps and must not require WebStorm-specific configuration.

## Ordered implementation

1. Initialize Astro and TypeScript with a pinned package manager and lockfile.
2. Add static site configuration, shared layout, 404 and content schema.
3. Add README/development commands and a minimal fixture.
4. Run clean install and static build locally.

## Readiness, impact and acceptance matrix

Risk: medium; establishes the runtime and route architecture for the site. Affected components and dependent callers: project root, src/**, public/**, package manifest and lockfile. UI/data/concurrency/compatibility/security impact: Static rendering only; no server-side state or user data..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | A clean checkout installs using documented Node and package-manager versions. | Build | Use the documented clean install command | Fresh checkout | Dependencies install reproducibly from the lockfile. |
| AC-02 | The Astro project generates static output and includes the shared shell plus a 404 route. | Build and route inspection | Run documented build command | Local build output | Build succeeds and static output contains expected routes/assets. |
| AC-03 | README documents local development, content location, build and verification commands. | Documentation review | Follow README commands in a clean checkout | CLI environment without IDE | Commands work without IDE-specific steps. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

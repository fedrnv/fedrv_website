---
schema: fdtasks-spec/v4
id: FDWEB-013
title: "Run the product-pages and launch integration gate"
type: Task
area: quality
component: epic-d002-gate
epic_id: FDWEB-EPIC-D002
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Verify all three product pages and the manually controlled deployment as one integrated FEDRV.DE launch candidate."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Verify all three product pages and the manually controlled deployment as one integrated FEDRV.DE launch candidate."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-009","FDWEB-010","FDWEB-011","FDWEB-012"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-013 — Run the product-pages and launch integration gate

## Goal

Verify all three product pages and the manually controlled deployment as one integrated FEDRV.DE launch candidate.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.

## Scope

Run local checks declared by members; verify page navigation, cross-links, product claims, generated metadata and staging publication; record the production deployment authorization separately if applicable.

## Boundaries and compatibility

Do not substitute staging evidence for production HTTPS acceptance. Do not perform unauthorized DNS or production changes. Keep the gate limited to D002 and direct interactions.

## Failure and recovery

Any failed member criterion blocks gate acceptance. Correct only through a bounded in-scope task and repeat affected checks.

## Ordered implementation

1. Freeze D002 candidate and collect current member evidence.
2. Review project pages together and test links/routes.
3. Validate staging deployment and rollback before any authorized production publication.
4. Record gate result and limitations.

## Readiness, impact and acceptance matrix

Risk: high; combines public product claims with deployment boundary. Affected components and dependent callers: FDUpdate/COT/FDStorage pages and deployment workflow/server configuration. UI/data/concurrency/compatibility/security impact: Public-facing routes and external deployment; no unsupported production claim..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Each D002 page has verified claims, working navigation and unique metadata. | Integrated content/UI check | Build and inspect all three routes and links | Frozen D002 static output | No unsupported claim, broken internal route or duplicate metadata. |
| AC-02 | Manual-only staging deployment and rollback pass; production status is recorded accurately. | Deployment gate | Use deployment task's documented staging and smoke-check commands | Authorized staging target | The previous version remains recoverable; no unapproved production effect occurs. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

---
schema: fdtasks-spec/v4
id: FDWEB-012
title: "Deploy FEDRV.DE to the VPS through manual GitHub Actions"
type: Task
area: deployment
component: vps-deployment
epic_id: FDWEB-EPIC-D002
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Provide a documented, manually triggered deployment of the static site to the authorized VPS with HTTPS and a rollback path."],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"The work delivers one independently acceptable result: Provide a documented, manually triggered deployment of the static site to the authorized VPS with HTTPS and a rollback path."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-007","FDWEB-009","FDWEB-010","FDWEB-011"]
created_at: 2026-10-19T12:00:00Z
created_by: "Project owner request and Codex"
---

# FDWEB-012 — Deploy FEDRV.DE to the VPS through manual GitHub Actions

## Goal

Provide a documented, manually triggered deployment of the static site to the authorized VPS with HTTPS and a rollback path.

## Inputs and source baseline

- Site repository baseline before this backlog: `71a173ccf0c351ce4d0e69995c5c916954d3ee03`.
- Normative task lifecycle: [FDTasks 5.6](../../../tasks_file_structure_v5_6.md), SHA-256 `ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403`.
- Discussion mirror: [GitHub issue #9](https://github.com/fedrnv/fedrv_website/issues/9). This TASK.md defines the canonical scope.

## Scope

Choose and configure one web server; prepare static artifact publication over SSH with GitHub Secrets; support workflow_dispatch only; configure canonical domain redirects, TLS renewal, post-deploy smoke check and previous-version rollback instructions.

## Boundaries and compatibility

Do not commit credentials. Do not configure live DNS, expose the VPS, or publish to the production domain until current owner authorization and target values are available. Hosted workflows may build/package/publish but not run task or product test suites.

## Failure and recovery

A failed build or upload must preserve the active site; deployment failure must report the target and leave a rollbackable prior release.

## Ordered implementation

1. Decide Nginx or Caddy and document prerequisites.
2. Build an atomic publish/rollback flow and manual-only workflow.
3. Verify against a non-production target or owner-authorized staging environment.
4. Deploy to production only after authorization; verify HTTPS and redirects.

## Readiness, impact and acceptance matrix

Risk: high; production deployment, DNS, credentials and public availability. Affected components and dependent callers: GitHub workflow, server configuration, secrets and public host. UI/data/concurrency/compatibility/security impact: Public site availability; privilege and external-effect boundaries apply..

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Only workflow_dispatch can start the deployment workflow and required secrets are referenced by name only. | Workflow inspection | Inspect workflow trigger and secret references | GitHub workflow source | No automated deploy trigger exists and no secret value is committed. |
| AC-02 | A failed build or publish leaves the currently served release intact and rollback is documented. | Deployment failure simulation | Exercise the documented staging failure and rollback steps | Staging VPS | Active site remains or is restored to the previous known-good release. |
| AC-03 | Authorized production endpoint serves the site over HTTPS with canonical redirects. | External smoke check | Use documented HTTP/HTTPS checks after owner-authorized deployment | Production domain and VPS | HTTPS succeeds and noncanonical/HTTP requests redirect as documented. |

## Completion evidence and cleanup

Record exact source and policy revisions, commands/manual scenarios, outcomes, limitations, inspected visual evidence when applicable, review findings and cleanup. Run the declared local checks and direct changed-boundary tests once on the stable candidate. Do not leave placeholders in a ready task.

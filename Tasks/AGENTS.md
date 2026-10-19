# Tasks/AGENTS.md

These rules supplement the repository-root `AGENTS.md`. The normative cross-repository lifecycle is [FDTasks 5.6](tasks_file_structure_v5_6.md); project profile and compatibility baseline are in this directory.

- Before changing work records, read the applicable `TASK.md` or `EPIC.md`, all material events and linked evidence, plus `lifecycle.json`, `project-profile.json`, and `tasks_file_structure_v5_6.md`.
- New executable items are medium-sized and have exactly one independently verifiable outcome, bounded scope, dependencies, exclusions, failure/recovery behavior, risk, stable AC IDs, and an AC-to-test readiness matrix.
- New task front matter includes the required `atomicity` declaration. One implementation packet is the default; two or three require a short inseparability reason.
- New development Epics use `FDWEB-EPIC-Dnnn`; `FDWEB-EPIC-S001` is the permanent process/rules Correction container; `FDWEB-EPIC-S002` is the permanent isolated maintenance container.
- A development Epic has no more than six functionality items and includes exactly one targeted integration-gate task and one independent review task.
- Accepted specifications, events, evidence, review records and version records are immutable. Record material status, dependency, decision, verification and closure changes as append-only v4 JSON events using UTC and unique event IDs.
- Current status is derived from ordered events, not from `initial_status`. Never mark a task Done without verified acceptance evidence.
- Do not hand-edit generated catalogs, status summaries or Kanban projections. GitHub Issues are mirrors for discussion; the `Tasks/` records define accepted scope.

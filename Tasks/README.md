# FDTasks for FEDRV.DE

This directory is the canonical task ledger for the website repository.

## Adopted format
The repository follows generic **FDTasks 5.6**, using the normative cross-repository specification in [tasks_file_structure_v5_6.md](tasks_file_structure_v5_6.md). The source is the FDOS repository at commit `35dbbad2744f6cc03ad91a8d2deb19d56ba7deb3`; the policy SHA-256 is recorded in [lifecycle.json](lifecycle.json) and [LIFECYCLE_VERSION_HISTORY.md](LIFECYCLE_VERSION_HISTORY.md).

- Project ID and task prefix: `FDWEB`.
- New task records use `fdtasks-spec/v4`; new Epic records use `fdtasks-epic/v4`.
- New development Epics use `FDWEB-EPIC-D001` onward.
- `FDWEB-EPIC-S001` permanently contains process and rules Corrections.
- `FDWEB-EPIC-S002` permanently contains isolated maintenance.
- Task records live in `Tasks/items/<area>/<task-id>-<slug>/TASK.md`.
- Epic records live in `Tasks/epics/<epic-id>-<slug>/EPIC.md`.
- Material events and evidence are stored beside the item they describe.

## GitHub Issues
Issues #2–#10 are discussion mirrors for the initial backlog. Their corresponding canonical FDTasks records link back to those Issues. Issue #1 is an umbrella overview; the formal development Epics and their memberships are the records under `Tasks/epics/`.

## Initial work
- [FDWEB-001](items/governance/FDWEB-001-adopt-fdtasks-5-6/TASK.md): establish and verify the repository task rules and migrate the initial backlog.
- Development Epic D001: site foundation and reusable project catalog.
- Development Epic D002: product pages and manual VPS launch.

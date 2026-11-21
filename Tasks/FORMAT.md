# FDTasks format entry point

## Current developer rules — FDTasks 5.7

Read [FDTasks_5_7_ADOPTION.md](FDTasks_5_7_ADOPTION.md) and the complete
[tasks_file_structure_v5_7.md](tasks_file_structure_v5_7.md) before
selecting, claiming, resuming or closing work. This owner-requested developer
policy supersedes older generic developer-rule references below; exact source
identity and local status mapping are in `developer-policy.json`.
Several developers may share one Epic, each task has one published owner.
Refresh GitHub/project state, publish the claim before implementation, and
immediately push every commit and verified closure. A losing claim refreshes
and reselects; it is never replayed over the winner. Preserve accepted history,
product safety and explicit owner exceptions. Native/automated activation is
separate and must retain its actual qualified version; see the adoption boundary.

FEDRV.DE follows generic FDTasks 5.6. The normative lifecycle is [tasks_file_structure_v5_6.md](tasks_file_structure_v5_6.md); repository adoption and compatibility are recorded in [lifecycle.json](lifecycle.json), [project-profile.json](project-profile.json), and [compatibility-baseline.json](compatibility-baseline.json).

New work uses immutable v4 task and Epic specifications, one outcome per executable item, stable acceptance criteria and a readiness matrix. Material changes use append-only v4 JSON events. See [Tasks/AGENTS.md](AGENTS.md) and the templates in [templates/](templates/).

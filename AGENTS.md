# Repository instructions

These rules apply to the FEDRV.DE website repository.

## Task authority
- The canonical backlog is under `Tasks/`; GitHub Issues are discussion and navigation mirrors.
- Before implementation, read this file, `DEVELOPMENT.md`, `Tasks/AGENTS.md`, the applicable `TASK.md` and its parent `EPIC.md`.
- Do not change the scope or acceptance criteria of an accepted task in place. Record material changes through the FDTasks append-only lifecycle.
- Keep one primary closure target and make a coherent, reviewed change.

## Development
- All development, build, verification and deployment operations must be available through documented CLI commands; an IDE must not be required.
- Hosted GitHub Actions workflows use `workflow_dispatch` only. They may build and publish; task acceptance and product tests run locally.
- Production deployment is always manually initiated. Keep credentials in GitHub Secrets or the VPS secret store; never commit them.
- Keep the public site static unless an accepted task explicitly adds a server-side requirement.
- Use real project facts, links and visual materials. Mark planned capabilities clearly; do not imply that unimplemented functions are available.
- Preserve existing product icons in `public/icons/` and update them only through an accepted task.

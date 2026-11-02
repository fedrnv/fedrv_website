# FDUpdate Server self-update

FDUpdate Server registers as product `fdupdate-server`; database migration, hawkBit and edge components use the same product-neutral FDUpdater target contract as other software. FDUpdater and its bootstrap remain separate host services and outside the server Compose project.

The server adapter downloads and verifies the complete signed release before activation, then persists the update intent and artifact bytes locally. It applies components in the declared dependency order. Each component still passes the ordinary FDUpdater staging, atomic activation and health checks. A rolled-back component stops dependent activation.

Once cached, execution requires no server request. This lets the edge and hawkBit services stop and restart while FDUpdater continues from local state. If candidate health fails, the ordinary transaction engine restores the retained previous slot and restarts it. The result remains local until the server becomes available for reporting.

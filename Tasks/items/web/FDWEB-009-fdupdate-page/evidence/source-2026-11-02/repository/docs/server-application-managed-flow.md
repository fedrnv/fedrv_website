# Server flow for application-managed updates

The server creates a bounded assignment for one approved installation, exact product/component, channel, version and signed release. Check requests first authenticate the installation against the registry, then match that exact assignment. Paused assignments and other channels return no offer; revoked identities fail authentication. Artifact delivery continues through the approval and replay gate.

Progress and final reports authenticate against the same assignment. An identical retry is accepted without a second audit event; a changed report for the same assignment conflicts. The audit supplies the installation, assignment, outcome and installed version to rollout policy. Rollback releases use the signed rollback authorization already embedded in the assigned release.

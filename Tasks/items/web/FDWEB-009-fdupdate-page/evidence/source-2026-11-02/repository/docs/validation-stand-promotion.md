# Validation-stand promotion

Each product/component policy names exactly one validation installation. A new release or prerelease candidate is initially eligible only for that installation. Missing or multiple assignments reject the rollout.

The stand must report readiness, download, activation, restart and post-update health, then remain healthy through the configured observation period. Completion changes the state to `passed`; it never promotes automatically. A scoped operator creates the immutable promotion record, binding product, component, channel, version, every artifact digest, compatibility digest, stand, evidence digest and operator.

Fleet and canary selection accepts only the exact promoted identity. Changed artifacts, compatibility, channel or target replacement block rollout. Failed or incomplete evidence stays outside all later waves and retains a rollback path. FDUpdater releases use the same gate.

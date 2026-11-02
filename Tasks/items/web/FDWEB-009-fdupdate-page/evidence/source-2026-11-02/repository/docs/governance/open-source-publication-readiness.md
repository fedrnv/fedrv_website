# Open-source publication readiness

FDUpdate remains private until the owner authorizes the exact license and GitHub
visibility change. Run the local baseline audit from a clean checkout:

```text
node scripts/audit-public-readiness.mjs
gitleaks git --config .gitleaks.toml --redact --no-banner
```

The audit covers tracked secret/state file names, the complete locked Rust graph,
contributor identities and hosted workflow triggers. Gitleaks scans the complete
Git history. Its two narrow allowlists cover only immutable disposable fixtures:
the FDU-089 loopback credential and a deliberately incomplete JWT used to prove
rejection. A new match blocks publication and requires rotation when authenticity
cannot be disproved. Never put a finding's secret value in evidence.

The 2026-10-18 inventory found 1,726 tracked files, 610 scanned commits, one human
contributor identity (two author-name spellings with the same email), and four
retained manual build artifacts. The GitHub repository was private and `main` had
no branch-protection rule. Before visibility changes, enable private vulnerability
reporting, publish SECURITY and contribution policies, protect `main`, confirm
release artifacts contain only intended packages, and rerun both commands.

Repository history contains public project/source links, example.invalid-style
fixtures and the operational hostname `update.fedrv.de`. No customer identity or
private service address was found. Production configuration and credentials stay
outside Git. Historical task evidence is public engineering provenance and must
be reviewed as such; accepted records are immutable.

## Publication decision checklist

1. Owner approves the exact license recorded in `license-decision.md`.
2. All FDU-158 audit findings are closed and all D008 documentation/security
   policies are present.
3. The D008 gate and independent review accept one exact commit.
4. Owner explicitly authorizes GitHub visibility change. Capture the repository
   ID, source commit, settings baseline and timestamp before changing visibility.
5. Set visibility once, verify anonymous clone/docs/license/security links, then
   retain the prior settings record for rollback. A visibility rollback cannot
   retract already downloaded history, so a secret finding always requires
   rotation rather than relying on making the repository private again.

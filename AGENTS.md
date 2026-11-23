# NOVA repository workflow

## User-approved development and deployment rules

- Work in this NOVA repository, not the adjacent sebitcanvers_v3 repository.
- Start each new task on a `feature/<topic>` or `fix/<topic>` branch. Preserve unrelated uncommitted work; do not switch it into another task or discard it.
- `dev` is the integration branch. `prod` is the production release branch. Avoid direct development commits on either branch.
- Interpret the user's commit/pull workflow as commit + push + Pull Request merge unless they specify `git pull` explicitly. A local commit alone is not a deployment.
- When the user requests commit/PR/merge/deployment, check the diff and exclude credentials, environment files, caches and artifacts. Use the configured Git identity; ask for the missing author identity rather than inventing one.
- Merge reviewed, verified work into `dev`; promote to `prod` for a requested production release. Fetch remote state and resolve divergence explicitly; never force-push shared branches.
- Deploy the exact merged `prod` commit to Gabia using a new release directory. Record its commit SHA and retain the previous release. Do not deploy an arbitrary dirty working tree once the initial baseline is committed.
- Run suitable tests/type checks and build before production promotion. On the server, install from the lockfile and build for Linux. Only switch `/srv/nova/current` and restart `nova.service` after the release passes checks.
- If startup/health fails, restore the previous release link and restart NOVA. Verify public main, UX, Grid and health after deployment and report the deployed SHA and URL.
- Never alter Canvers (`sebit.service`, port 3001, existing Nginx 80/443) as part of NOVA deployment. NOVA uses its own Nginx port 8080 and loopback app port 4000.
- Never commit or upload the user's SSH private key, .env credentials, Git credentials or secret values. Supply SSH keys by local file path only.

## Deployment references

- Production URL: http://1.201.110.199:8080
- SSH account: `ubuntu` on `1.201.110.199` (default port 22).
- Service user: `nova`; unit: `nova.service`.
- Release root: `/srv/nova/releases`; active symlink: `/srv/nova/current`.
- Environment: `/etc/nova/nova.env`, outside the releases.
- See `deploy/gabia/README.md` for operations and configuration sources.

These are agent workflow rules. No GitHub Actions pipeline, repository webhook, background monitoring, or automatic deployment on push is configured by this file. Carry out merge/deployment when the user requests that work in an active session; do not claim that a future push will be detected automatically.

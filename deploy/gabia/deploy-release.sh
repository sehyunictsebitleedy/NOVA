#!/usr/bin/env bash
set -euo pipefail
sha=${1:?Expected full prod commit SHA}
archive=${2:?Expected source archive}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid commit SHA'; exit 1; }
test -f "$archive"
previous=$(readlink -f /srv/nova/current)
release=$(mktemp -d "/srv/nova/releases/${sha:0:12}-XXXXXX")
chmod 0755 "$release"
tar -xzf "$archive" -C "$release"
printf '%s\n' "$sha" > "$release/REVISION"
cd "$release"
echo "Building prod commit $sha in $release"
npm ci --no-audit --no-fund > "$release/install.log" 2>&1
npm test > "$release/tests.log" 2>&1
npm run typecheck > "$release/typecheck.log" 2>&1
NODE_OPTIONS=--max-old-space-size=1024 npm run build > "$release/build.log" 2>&1
npm run test:integration > "$release/integration.log" 2>&1
# Test the candidate before switching the live service.
HOST=127.0.0.1 PORT=4002 NODE_ENV=production node apps/portal/.output/server/index.mjs > "$release/preflight.log" 2>&1 &
candidate=$!
trap 'kill "$candidate" 2>/dev/null || true' EXIT
ready=false
for attempt in $(seq 1 30); do
  if curl --fail --silent --max-time 3 http://127.0.0.1:4002/api/health >/dev/null; then ready=true; break; fi
  sleep 1
done
[[ "$ready" = true ]] || { echo 'Candidate health failed; production unchanged.'; exit 1; }
for path in / /ux /grid; do curl --fail --silent --max-time 20 "http://127.0.0.1:4002$path" >/dev/null; done
kill "$candidate"
wait "$candidate" || true
trap - EXIT
sudo ln -s "$release" "/srv/nova/.current-$sha"
sudo mv -Tf "/srv/nova/.current-$sha" /srv/nova/current
sudo systemctl restart nova
ready=false
for attempt in $(seq 1 30); do
  if curl --fail --silent --max-time 3 http://127.0.0.1:8080/api/health >/dev/null; then ready=true; break; fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  sudo ln -s "$previous" "/srv/nova/.rollback-$sha"
  sudo mv -Tf "/srv/nova/.rollback-$sha" /srv/nova/current
  sudo systemctl restart nova
  echo 'Production health failed; restored previous release.'
  exit 1
fi
printf 'DEPLOYED_SHA=%s\nRELEASE=%s\nPREVIOUS_RELEASE=%s\n' "$sha" "$release" "$previous"

#!/usr/bin/env bash
# Deploy JODO site on the Lightsail host.
# Usage (on the server):
#   bash ~/jodo/scripts/deploy.sh
# Or from CI over SSH.

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/jodo}"
BRANCH="${DEPLOY_BRANCH:-main}"
API_NAME="${API_NAME:-jodo-api}"
API_HOST="${HOST:-127.0.0.1}"
API_PORT="${PORT:-3001}"

echo "==> Deploying in ${APP_DIR} (branch: ${BRANCH})"
cd "${APP_DIR}"

echo "==> Fetching latest code"
git fetch origin "${BRANCH}"
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"

echo "==> Installing dependencies"
npm ci

echo "==> Building frontend"
npm run build

echo "==> Restarting API with pm2"
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found; start the API manually" >&2
  exit 1
fi

# Recreate the process so cwd/env are always correct after deploys.
pm2 delete "${API_NAME}" >/dev/null 2>&1 || true
HOST="${API_HOST}" PORT="${API_PORT}" pm2 start server/index.js \
  --name "${API_NAME}" \
  --cwd "${APP_DIR}"
pm2 save

echo "==> Reloading nginx"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -t
  sudo systemctl reload nginx || sudo systemctl restart nginx
fi

echo "==> Health checks"
ok=0
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://${API_HOST}:${API_PORT}/api/health" >/tmp/jodo-health.json 2>/dev/null; then
    cat /tmp/jodo-health.json
    echo
    ok=1
    break
  fi
  echo "waiting for API... (${i}/10)"
  sleep 1
done

if [ "${ok}" -ne 1 ]; then
  echo "API health check failed. Recent pm2 logs:" >&2
  pm2 logs "${API_NAME}" --lines 40 --nostream >&2 || true
  exit 1
fi

curl -fsS -o /dev/null -w "frontend:%{http_code}\n" "http://127.0.0.1/"
curl -fsS "http://127.0.0.1/api/health"
echo
echo "==> Deploy complete"

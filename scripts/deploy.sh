#!/usr/bin/env bash
# Deploy JODO site on the Lightsail host.
# Usage (on the server):
#   bash ~/jodo/scripts/deploy.sh
# Or from CI over SSH.

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/jodo}"
BRANCH="${DEPLOY_BRANCH:-main}"
API_NAME="${API_NAME:-jodo-api}"

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
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe "${API_NAME}" >/dev/null 2>&1; then
    HOST=127.0.0.1 PORT=3001 pm2 restart "${API_NAME}" --update-env
  else
    HOST=127.0.0.1 PORT=3001 pm2 start server/index.js --name "${API_NAME}"
  fi
  pm2 save
else
  echo "pm2 not found; start the API manually" >&2
  exit 1
fi

echo "==> Reloading nginx"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -t
  sudo systemctl reload nginx || sudo systemctl restart nginx
fi

echo "==> Health checks"
curl -fsS "http://127.0.0.1:3001/api/health"
echo
curl -fsS -o /dev/null -w "frontend:%{http_code}\n" "http://127.0.0.1/"
curl -fsS "http://127.0.0.1/api/health"
echo
echo "==> Deploy complete"

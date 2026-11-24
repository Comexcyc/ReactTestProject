# JODO Modern Website

Modern React + Vite starter project for redesigning the JODO corporate website.

## Run locally

1. Install dependencies:
   - `npm install`
2. Install Access DB tools (API reads the catalog file in the repo):
   - macOS: `brew install mdbtools`
   - Ubuntu/Debian: `sudo apt-get install mdbtools`
3. Optional: copy `.env.example` values into your shell / process manager.
4. Start development server:
   - `npm run dev`
5. Build for production:
   - `npm run build`

The sample catalog database `test-JODOUK.mdb` is included for local testing.

## Deploy to AWS Lightsail

Code on the server does **not** update by itself. After the first manual setup, use either:

### A) One-command update on the server

```bash
bash ~/jodo/scripts/deploy.sh
```

### B) Auto-deploy on push to `main` (GitHub Actions)

1. In Lightsail → instance → **Connect** → download / copy the SSH private key.
2. In GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - `LIGHTSAIL_HOST` — public IPv4 (e.g. `51.20.34.122`)
   - `LIGHTSAIL_USER` — usually `admin`
   - `LIGHTSAIL_SSH_KEY` — full private key text (including `BEGIN` / `END` lines)
3. Push to `main` (or run the **Deploy to Lightsail** workflow manually).

The workflow SSHs into the instance and runs `scripts/deploy.sh` (`git pull` → `npm ci` → `build` → `pm2 restart` → reload nginx).

## Security notes

- Public API responses intentionally omit pricing fields; source `unit_price` data in the MDB is not deleted.
- API defaults to `127.0.0.1` and an allowlisted CORS origin list. Override with `HOST` / `CORS_ORIGINS` when deploying.
- Keep `.env` files out of git. Before a real public launch, reconsider whether the full MDB should remain in the repository.

## Goals

- Replace the legacy table-based layout with a responsive modern interface
- Improve readability, navigation, and mobile experience
- Keep industrial brand trust while modernizing visuals

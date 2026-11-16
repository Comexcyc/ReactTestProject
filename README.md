# JODO Modern Website

Modern React + Vite starter project for redesigning the JODO corporate website.

## Run locally

1. Install dependencies:
   - `npm install`
2. Install Access DB tools (API reads the local catalog file):
   - macOS: `brew install mdbtools`
   - Ubuntu/Debian: `sudo apt-get install mdbtools`
3. Place the private catalog database file at the repo root as `test-JODOUK.mdb`  
   (this file is gitignored and must be shared privately, not committed).
4. Optional: copy `.env.example` values into your shell / process manager.
5. Start development server:
   - `npm run dev`
6. Build for production:
   - `npm run build`

## Security notes

- Public API responses intentionally omit pricing fields; source `unit_price` data in the MDB is not deleted.
- API defaults to `127.0.0.1` and an allowlisted CORS origin list. Override with `HOST` / `CORS_ORIGINS` when deploying.
- Do not commit `.mdb` files, credentials, or `.env` files.

## Goals

- Replace the legacy table-based layout with a responsive modern interface
- Improve readability, navigation, and mobile experience
- Keep industrial brand trust while modernizing visuals

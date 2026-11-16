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

## Security notes

- Public API responses intentionally omit pricing fields; source `unit_price` data in the MDB is not deleted.
- API defaults to `127.0.0.1` and an allowlisted CORS origin list. Override with `HOST` / `CORS_ORIGINS` when deploying.
- Keep `.env` files out of git. Before a real public launch, reconsider whether the full MDB should remain in the repository.

## Goals

- Replace the legacy table-based layout with a responsive modern interface
- Improve readability, navigation, and mobile experience
- Keep industrial brand trust while modernizing visuals

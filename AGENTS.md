# Base44 Dev Environment

## Project Overview
TomutStore — a frontend-only financial dashboard built with Vite + React 18 + Tailwind CSS + MUI + Recharts.
Data persistence uses browser `localStorage` (see `src/data/database.js`). There is no backend or database service.

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
The Vite dev server runs on port 5173 inside the container, mapped to host port 3000.
Dependencies are installed from `pnpm-lock.yaml` on container startup via `corepack enable pnpm && pnpm install --frozen-lockfile`.

## Key Details
- **Package manager:** pnpm 10.10.0 (via corepack on node:22-slim)
- **No external secrets required** — the app is fully client-side.
- `@supabase/supabase-js` is listed as a dependency but is not imported anywhere in the source.
- Vite config has `server.host: true` and `allowedHosts: true` to accept the preview's external hostname.
- Source files were extracted from `Dashboard Creation Request.zip` (original repo only contained the zip).

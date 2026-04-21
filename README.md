# Numeric Discussion

Numeric Discussion is a fullstack app where users create numeric roots and replies that apply math operations (`add`, `sub`, `mul`, `div`) to form a recursive discussion tree.

This monorepo contains:
- `server` - Express + TypeScript API, Knex/PostgreSQL, JWT auth
- `client` - React + Vite frontend

## Container Architecture

The repository uses a single `docker-compose.yml` with profiles:
- `prod` profile:
  - `db` (PostgreSQL 16)
  - `server` (multi-stage Node runtime image)
  - `client` (multi-stage build served by nginx, proxies `/api/*` to `server:3000`)
  - `adminer` (optional DB UI)
- `dev` profile:
  - `db`
  - `server-dev` (Node container with source mounted, runs `npm run dev`)
  - `client-dev` (Vite dev server in container)
  - `adminer`

## Prerequisites

- Docker + Docker Compose
- Node.js 20+ and npm (only needed if you also run packages outside containers)

## Environment Variables

1. Copy the template:

```bash
cp .env.example .env
```

2. Required notes:
- Set `JWT_SECRET` to a long random value (at least 32 chars).
- For compose-based workflows, keep `POSTGRES_HOST=db` and `POSTGRES_PORT=5432`.
- `VITE_API_URL` is used by the Vite client in `dev` profile.

Key values in `.env`:
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
- `VITE_API_URL`

## Run Modes

### Production-like Local Run (`prod` profile)

Build and start:

```bash
docker compose --profile prod up --build
```

Endpoints:
- App (nginx): `http://localhost:80`
- API: `http://localhost:3000`
- Postgres (host): `localhost:5433` -> container `5432`
- Adminer: `http://localhost:8080`

Stop:

```bash
docker compose --profile prod down
```

### Development Container Workflow (`dev` profile)

Start dev stack:

```bash
docker compose --profile dev up --build
```

Endpoints:
- Vite client: `http://localhost:5173`
- API: `http://localhost:3000`
- Adminer: `http://localhost:8080`

Stop:

```bash
docker compose --profile dev down
```

Remove containers, network, and volume:

```bash
docker compose --profile dev down -v
```

## Manual Smoke Checks

After startup (`prod` or `dev`):

1. Confirm containers are running:

```bash
docker compose ps
```

Expected: relevant services show `Up`/`running`.

2. Check API health:

```bash
curl http://localhost:3000/api/nodes
```

Expected: HTTP 200 response with JSON payload (empty or populated list).

3. Check client page load:
- Open `http://localhost:80` (`prod`) or `http://localhost:5173` (`dev`).
- Expected: app shell renders without nginx or Vite crash page.

4. Check SPA fallback routing:
- Navigate directly to a non-root frontend route in browser.
- Expected: app still loads (served through `index.html` fallback).

5. Check nginx API proxy (`prod` profile):

```bash
curl http://localhost/api/nodes
```

Expected: request succeeds and returns same JSON shape as direct API access.

## Troubleshooting

- `server` exits on startup in `prod`:
  - Check DB is healthy: `docker compose ps`.
  - Confirm `.env` uses compose DB values (`POSTGRES_HOST=db`, `POSTGRES_PORT=5432`).
- Client cannot reach API in `dev`:
  - Verify `server-dev` is running and logs show API listening on `3000`.
  - Verify `VITE_API_URL` in `.env` points to `http://localhost:3000`.
- Migration/auth/environment errors:
  - Re-check `.env` values and secret formatting.
  - Recreate containers: `docker compose --profile <prod|dev> down && docker compose --profile <prod|dev> up --build`.
- Stale database state:
  - Use `docker compose --profile <prod|dev> down -v` to reset local volume data.

## Package Docs

- [server/README.md](server/README.md)
- [client/README.md](client/README.md)

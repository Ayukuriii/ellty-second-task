# Numeric Discussion — Server

Backend for **Numeric Discussion**: PostgreSQL stores **users** and a **tree of nodes** where each node references a parent (except roots), an **operation** (`none`, `add`, `sub`, `mul`, `div`), an **operand**, and a stored **result**. Migrations live in `src/models/migrations/`.

Stack (from dependencies): **Express**, **Knex** + **pg**, **JWT** auth, **Socket.io**, **Zod** for configuration validation, **Pino** for logging.

## Prerequisites

- Node.js 20+
- npm
- A running **PostgreSQL** instance and a database you can connect to

## Installation

```bash
cd server
npm install
```

Environment files are loaded from the **parent directory** (repository root) so the API and Knex share one `.env` with the rest of the monorepo:

- `.env.local` (optional, loaded first without overriding existing variables)
- `.env`

Copy from the repo root:

```bash
cp ../.env.example ../.env
```

Edit `../.env` and set all required variables (see below).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development`, `production`, or `test` (default `development`) |
| `PORT` | HTTP port (default `3000`) |
| `POSTGRES_HOST` | Postgres host. Use **`db`** when the API runs in Docker Compose with this repo’s `docker-compose.yml`. Use **`localhost`** (or your host) when running `npm run dev` on your machine against a mapped port. |
| `POSTGRES_PORT` | Default `5432` |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Database credentials |
| `JWT_SECRET` | **At least 32 characters** |
| `JWT_EXPIRES_IN` | Default `7d` |
| `CLIENT_URL` | Full URL of the web app for CORS (e.g. `http://localhost:5173` in local Vite dev) |

If validation fails, the process exits with a short Zod error listing invalid fields.

## Database migrations

```bash
npm run migrate
```

Other scripts:

- `npm run migrate:make <name>` — create a new migration
- `npm run migrate:rollback` — rollback last batch

**Note:** `npm run migrate` only needs Postgres reachable with your current `POSTGRES_*` settings. If you see `getaddrinfo ENOTFOUND db`, the host `db` is not resolvable on your machine—switch to `localhost` (and the correct port, e.g. `5433` if using this repo’s Compose DB mapping).

Production migrations use compiled JS under `dist/models/migrations/` (see `knexfile.ts`).

## Running the server

```bash
npm run dev
```

Starts `ts-node-dev` on `src/server.ts` (reload on change).

```bash
npm run build
npm start
```

Compiles with `tsc` and runs `node dist/server.js`.

## Other scripts

- `npm test` — Jest with coverage
- `npm run lint` — ESLint on `src/**/*.ts`

## Docker

The repo root `docker-compose.yml` builds this service with `server/Dockerfile`: build stage runs `npm run build`, runtime runs migrations then `npm run start`.

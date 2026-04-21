# Numeric Discussion

Monorepo for **Numeric Discussion**, a collaborative app where people build a **tree of numeric steps**: each **node** stores an operation (add, subtract, multiply, divide), an operand, and a precomputed **result** chained from its parent. **Users** own nodes; the data model is implemented in PostgreSQL migrations under the server package.

This repository contains:

| Package   | Role |
|-----------|------|
| **server** | Node.js API, PostgreSQL via Knex, JWT auth (see server `package.json` for the full stack). |
| **client** | React + Vite front end. |

Optional **Docker Compose** brings up Postgres, the API, the static client (nginx), and Adminer for database browsing.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (matches the Docker images)
- [npm](https://docs.npmjs.com/cli/v10/commands/npm)
- For local Postgres without Docker: PostgreSQL 16 (or use Compose for the database only)

## Quick start with Docker

From the **repository root** (where `docker-compose.yml` lives):

1. Copy the environment template and adjust secrets:

   ```bash
   cp .env.example .env
   ```

   Set `JWT_SECRET` to a **random string of at least 32 characters** (the server validates this). Align `POSTGRES_*` values with what you use in Compose.

2. Start everything:

   ```bash
   docker compose up --build
   ```

   - API: port **3000** (mapped from the `server` service)
   - Client (nginx): port **80**
   - Postgres: **5433** on the host → 5432 in the container (for GUI clients)
   - Adminer: **8080**

Inside Compose, the database hostname is **`db`**. That matches `.env.example`; use it only when the API runs **in Docker** on the same Compose network.

## Local development (without full Compose)

Run Postgres (for example `docker compose up db` only), then:

1. Use a **host-reachable** Postgres address in `.env` at the repo root, for example:

   - `POSTGRES_HOST=localhost`
   - `POSTGRES_PORT=5433` if you use the Compose `db` service port mapping from this project

2. Install and run **server** and **client** in two terminals (see [server/README.md](server/README.md) and [client/README.md](client/README.md)).

3. Apply database migrations from the `server` directory:

   ```bash
   cd server && npm run migrate
   ```

## Documentation

- [server/README.md](server/README.md) — environment variables, migrations, API scripts
- [client/README.md](client/README.md) — front-end dev and build

## License

See package licenses in `server/package.json` and `client/package.json` (project metadata may list ISC / private as applicable).

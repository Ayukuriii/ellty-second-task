# Numeric Discussion — Client

Web front end for **Numeric Discussion**, built with **React 19**, **Vite**, **TypeScript**, and tooling such as **TanStack Query**, **React Router**, **Axios**, and **Zustand** (see `package.json`).

The dev server defaults to **http://localhost:5173**.

## Prerequisites

- Node.js 20+ recommended (aligned with the monorepo Docker images)
- npm

## Installation

```bash
cd client
npm install
```

## Environment variables

Vite only exposes variables prefixed with `VITE_`. At the **repository root**, `.env.example` includes:

```env
VITE_API_URL=http://localhost:3000
```

Copy or merge into the root `.env` / `.env.local` if the client should call a non-default API base URL. Use the URL where the **server** listens (e.g. `http://localhost:3000` for local API).

## Running the app

```bash
npm run dev
```

Opens the Vite dev server with hot module replacement.

```bash
npm run build
npm run preview
```

Production build and local preview of the static output.

## Other scripts

- `npm test` — Vitest with coverage
- `npm run lint` — ESLint on `src/**/*.tsx`

## Docker

The repo root `docker-compose.yml` builds this app with `client/Dockerfile`: multi-stage build with **nginx** serving the Vite `dist` output on port **80** inside the container (mapped to host port 80 in the default Compose file).

For day-to-day UI work, local `npm run dev` is usually simpler than rebuilding the client image.

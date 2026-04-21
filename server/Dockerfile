# ─── STAGE 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY knexfile.ts ./

RUN npm run build          # runs tsc → outputs to /app/dist

# ─── STAGE 2: Run ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev      # production deps only — no devDependencies

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/knexfile.ts ./knexfile.ts

EXPOSE 3000

CMD ["node", "dist/server.js"]
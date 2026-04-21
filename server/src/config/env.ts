import path from 'node:path'
import dotenv from 'dotenv'
import { z } from 'zod'

/** This file lives at `server/src/config`; `server/` and repo root both may hold env files. */
const serverRoot = path.resolve(__dirname, '../..')
const repoRoot = path.resolve(__dirname, '../../..')

// Default `dotenv.config()` only reads `process.cwd()/.env` — empty when vars live at repo root.
// Later files override earlier ones (same convention as Docker + local overrides).
dotenv.config({ path: path.join(repoRoot, '.env') })
dotenv.config({ path: path.join(repoRoot, '.env.local'), override: true })
dotenv.config({ path: path.join(serverRoot, '.env'), override: true })
dotenv.config({ path: path.join(serverRoot, '.env.local'), override: true })

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),

  // Postgres
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().default('5432'),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CLIENT_URL: z.string().url(),
})

// crashes immediately with a readable error if validation fails
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data

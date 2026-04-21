import type { Knex } from 'knex'
import path from 'path'

// loads .env.local if it exists, falls back to .env
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env.local'),
  override: false, // won't override vars already in process.env
})
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
})

const config: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST!,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      database: process.env.POSTGRES_DB!,
      user: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
    },
    migrations: {
      directory: './src/models/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST!,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      database: process.env.POSTGRES_DB!,
      user: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
    },
    migrations: {
      directory: './dist/models/migrations',
      extension: 'js',
      loadExtensions: ['.js'],
    },
    pool: { min: 2, max: 10 },
  },
}

export default config

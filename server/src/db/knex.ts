import knexLib from 'knex'
import { env } from '../config/env'

/**
 * Singleton Knex instance shared across all repositories.
 * Connection pooling is handled internally by Knex (default: min 2, max 10).
 */
const knex = knexLib({
  client: 'pg',
  connection: {
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  // logs every query in development — remove in production
  debug: env.NODE_ENV === 'development',
})

export default knex

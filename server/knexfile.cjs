const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env.local'),
  override: false,
})
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
})

/** @type {import('knex').Knex.Config} */
const base = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
}

module.exports = {
  development: {
    ...base,
    migrations: {
      directory: './src/models/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  },
  production: {
    ...base,
    migrations: {
      directory: './dist/models/migrations',
      extension: 'js',
      loadExtensions: ['.js'],
    },
    pool: { min: 2, max: 10 },
  },
}
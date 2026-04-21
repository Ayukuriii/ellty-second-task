import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { apiRouter } from './routes'
import { logger } from './utils/logger'

export function createApp(): express.Application {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(pinoHttp({ logger }))

  app.use('/api', apiRouter)

  app.use(errorHandler)

  return app
}

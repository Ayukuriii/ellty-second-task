import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'

/** Global error JSON: at least `{ message }`. Optional `code` (AppError), `errors` (Zod 400). */
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof AppError) {
    const body: { message: string; code?: string } = { message: err.message }
    if (err.code !== undefined) {
      body.code = err.code
    }
    res.status(err.statusCode).json(body)
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.flatten(),
    })
    return
  }

  logger.error(err)
  res.status(500).json({ message: 'Internal server error' })
}

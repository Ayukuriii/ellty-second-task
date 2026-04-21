import type { RequestHandler } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      next(parsed.error)
      return
    }
    req.body = parsed.data
    next()
  }
}

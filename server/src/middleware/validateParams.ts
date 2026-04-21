import type { RequestHandler } from 'express'
import type { ZodSchema } from 'zod'

export function validateParams<T extends Record<string, string>>(
  schema: ZodSchema<T>
): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.params)
    if (!parsed.success) {
      next(parsed.error)
      return
    }
    Object.assign(req.params, parsed.data)
    next()
  }
}

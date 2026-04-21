import type { RequestHandler } from 'express'
import { AppError } from '../utils/AppError'
import { verifyToken } from '../utils/jwt'

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization
  if (header === undefined || !header.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401))
    return
  }

  const token = header.slice('Bearer '.length).trim()
  if (token.length === 0) {
    next(new AppError('Unauthorized', 401))
    return
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    next(new AppError('Unauthorized', 401))
  }
}

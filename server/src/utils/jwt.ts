import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'
import type { JwtPayload } from '../types/jwt.types'

export function signToken(payload: JwtPayload): string {
  const options = {
    subject: payload.sub,
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions
  return jwt.sign({ username: payload.username }, env.JWT_SECRET, options)
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & {
    username?: string
  }
  if (typeof decoded.sub !== 'string' || typeof decoded.username !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { sub: decoded.sub, username: decoded.username }
}

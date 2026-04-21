import type { JwtPayload } from './jwt.types'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export {}

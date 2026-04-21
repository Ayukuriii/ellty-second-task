import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/UserRepository'
import type { LoginBody, RegisterBody } from '../validation/auth.schemas'
import { AppError } from '../utils/AppError'
import { signToken } from '../utils/jwt'
import type { UserRow } from '../models/types/user.types'

const BCRYPT_ROUNDS = 10

export interface AuthSuccess {
  token: string
  user: { id: string; username: string; avatar_url: string | null }
}

export class AuthService {
  constructor(private readonly users: UserRepository = new UserRepository()) {}

  async register(body: RegisterBody): Promise<AuthSuccess> {
    const existing = await this.users.findByUsername(body.username)
    if (existing) {
      throw new AppError('Username already taken', 409)
    }
    const password_hash = await bcrypt.hash(body.password, BCRYPT_ROUNDS)
    const user = await this.users.create({
      username: body.username,
      password_hash,
    })
    return this.toAuthResponse(user)
  }

  async login(body: LoginBody): Promise<AuthSuccess> {
    const user = await this.users.findByUsername(body.username)
    const valid =
      user !== null && (await bcrypt.compare(body.password, user.password_hash))
    if (!valid) {
      throw new AppError('Invalid username or password', 401)
    }
    return this.toAuthResponse(user)
  }

  private toAuthResponse(user: UserRow): AuthSuccess {
    const token = signToken({ sub: user.id, username: user.username })
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    }
  }
}

export const authService = new AuthService()

export interface AuthUser {
  id: string
  username: string
  avatar_url: string | null
}

export interface AuthPayload {
  token: string
  user: AuthUser
}

export interface AuthRequestPayload {
  username: string
  password: string
}

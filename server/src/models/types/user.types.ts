export interface UserRow {
  id: string
  username: string
  password_hash: string
  avatar_url: string | null
  created_at: Date
  updated_at: Date
}

/** Fields supplied on insert — DB sets id and timestamps */
export type NewUserRow = {
  username: string
  password_hash: string
  avatar_url?: string | null
}

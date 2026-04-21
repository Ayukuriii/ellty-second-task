export interface UserRow {
  id: string                    // UUID
  username: string
  password_hash: string
  avatar_url: string | null
  created_at: Date
}

/** Shape for inserting a new user — omit DB-generated fields */
export type NewUserRow = Omit<UserRow, 'id' | 'created_at'>

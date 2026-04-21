import knex from '../db/knex'
import type { NewUserRow, UserRow } from '../models/types/user.types'

export class UserRepository {
  async create(row: NewUserRow): Promise<UserRow> {
    const insert: { username: string; password_hash: string; avatar_url?: string | null } = {
      username: row.username,
      password_hash: row.password_hash,
    }
    if (row.avatar_url !== undefined) {
      insert.avatar_url = row.avatar_url
    }

    const rows = await knex<UserRow>('users').insert(insert).returning('*')
    const created = rows[0]
    if (!created) {
      throw new Error('User insert returned no row')
    }
    return created
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    const row = await knex<UserRow>('users').where({ username }).first()
    return row ?? null
  }

  async findById(id: string): Promise<UserRow | null> {
    const row = await knex<UserRow>('users').where({ id }).first()
    return row ?? null
  }
}

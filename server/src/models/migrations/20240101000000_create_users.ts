import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('username', 50).notNullable().unique()
    table.text('password_hash').notNullable()
    table.text('avatar_url').nullable()
    table.timestamps(true, true) // created_at, updated_at with defaults
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users')
}

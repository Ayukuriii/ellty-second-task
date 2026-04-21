import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // create the operation enum type in Postgres
  await knex.raw(`
    CREATE TYPE operation_type AS ENUM ('none', 'add', 'sub', 'mul', 'div')
  `)

  await knex.schema.createTable('nodes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))

    // author — who posted this node
    table
      .uuid('author_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    // parent — null means this is a root node (starting number)
    table
      .uuid('parent_id')
      .nullable()
      .references('id')
      .inTable('nodes')
      .onDelete('CASCADE') // deleting a node removes its entire subtree

    // operation applied to parent's result ('none' for root nodes)
    table
      .specificType('operation', 'operation_type')
      .notNullable()
      .defaultTo('none')

    // user-chosen right-hand number (e.g. the "3" in "× 3")
    table.decimal('operand', 20, 10).notNullable()

    // pre-computed result stored at write time — avoids recursive reads
    table.decimal('result', 20, 10).notNullable()

    table.timestamps(true, true)

    // indexes for the two most common query patterns
    table.index('parent_id') // fetch children of a node
    table.index('created_at') // sort root nodes by time
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('nodes')
  await knex.raw(`DROP TYPE IF EXISTS operation_type`)
}

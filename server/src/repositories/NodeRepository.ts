import type { Knex } from 'knex'
import knex from '../db/knex'
import type { NewNodeRow, NodeRow, NodeWithAuthor } from '../models/types/node.types'

/** Postgres `numeric` / Knex may return string; normalize for API types */
function numericToNumber(value: string | number): number {
  return typeof value === 'number' ? value : Number(value)
}

function mapNodeRow(row: Record<string, unknown>): NodeRow {
  return {
    id: String(row.id),
    author_id: String(row.author_id),
    parent_id: row.parent_id === null || row.parent_id === undefined ? null : String(row.parent_id),
    operation: row.operation as NodeRow['operation'],
    operand: numericToNumber(row.operand as string | number),
    result: numericToNumber(row.result as string | number),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  }
}

function mapNodeWithAuthor(row: Record<string, unknown>): NodeWithAuthor {
  const base = mapNodeRow(row)
  return {
    ...base,
    author: {
      id: base.author_id,
      username: String(row.author_username),
      avatar_url:
        row.author_avatar_url === undefined || row.author_avatar_url === null
          ? null
          : String(row.author_avatar_url),
    },
  }
}

const nodeColumns = [
  'nodes.id',
  'nodes.author_id',
  'nodes.parent_id',
  'nodes.operation',
  'nodes.operand',
  'nodes.result',
  'nodes.created_at',
  'nodes.updated_at',
] as const

const authorSelect = ['users.username as author_username', 'users.avatar_url as author_avatar_url'] as const

export class NodeRepository {
  private baseUserJoin(builder: Knex.QueryBuilder): Knex.QueryBuilder {
    return builder
      .join('users', 'users.id', 'nodes.author_id')
      .select([...nodeColumns, ...authorSelect])
  }

  async findAllFlat(): Promise<NodeWithAuthor[]> {
    const rows = (await this
      .baseUserJoin(knex('nodes'))
      .orderBy('nodes.created_at', 'desc')) as Record<string, unknown>[]
    return rows.map((r) => mapNodeWithAuthor(r))
  }

  async findById(id: string): Promise<NodeRow | null> {
    const row = await knex<NodeRow>('nodes').where({ id }).first()
    if (row === undefined) {
      return null
    }
    return mapNodeRow(row as unknown as Record<string, unknown>)
  }

  async insert(row: NewNodeRow): Promise<NodeRow> {
    const insertPayload = {
      author_id: row.author_id,
      parent_id: row.parent_id,
      operation: row.operation,
      operand: row.operand,
      result: row.result,
    }
    const rows = await knex('nodes').insert(insertPayload).returning('*')
    const created = rows[0]
    if (created === undefined) {
      throw new Error('Node insert returned no row')
    }
    return mapNodeRow(created as unknown as Record<string, unknown>)
  }

  /**
   * Root node `id` and all descendants, ordered by `created_at` ascending.
   * Includes author fields via join on each selected row.
   */
  async findSubtreeByRootId(rootId: string): Promise<NodeWithAuthor[]> {
    const subtreeNodeSelect = [
      'nodes.id',
      'nodes.author_id',
      'nodes.parent_id',
      'nodes.operation',
      'nodes.operand',
      'nodes.result',
      'nodes.created_at',
      'nodes.updated_at',
    ] as const

    const rows = await knex
      .withRecursive('subtree', (qb) => {
        qb.select([...subtreeNodeSelect])
          .from('nodes')
          .where('nodes.id', rootId)
          .unionAll((uq) => {
            uq
              .select([...subtreeNodeSelect])
              .from('nodes')
              .innerJoin('subtree', 'subtree.id', 'nodes.parent_id')
          })
      })
      .select([
        'subtree.id',
        'subtree.author_id',
        'subtree.parent_id',
        'subtree.operation',
        'subtree.operand',
        'subtree.result',
        'subtree.created_at',
        'subtree.updated_at',
        ...authorSelect,
      ])
      .from('subtree')
      .join('users', 'users.id', 'subtree.author_id')
      .orderBy('subtree.created_at', 'asc')

    return (rows as Record<string, unknown>[]).map((r) => mapNodeWithAuthor(r))
  }
}

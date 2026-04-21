import { describe, expect, it } from 'vitest'

import type { NodeDto } from '../types/node.types'
import { buildTree } from './buildTree'

function makeNode(overrides: Partial<NodeDto>): NodeDto {
  const id = overrides.id ?? crypto.randomUUID()

  return {
    id,
    author_id: 'author-1',
    parent_id: null,
    operation: 'none',
    operand: 1,
    result: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    author: {
      id: 'author-1',
      username: 'alice',
      avatar_url: null,
    },
    ...overrides,
  }
}

describe('buildTree', () => {
  it('returns empty array for empty input', () => {
    expect(buildTree([])).toEqual([])
  })

  it('builds nested nodes from flat list', () => {
    const root = makeNode({ id: 'root', parent_id: null })
    const child = makeNode({ id: 'child', parent_id: 'root', operation: 'add' })
    const grandchild = makeNode({ id: 'grandchild', parent_id: 'child', operation: 'mul' })

    const tree = buildTree([root, child, grandchild])

    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('root')
    expect(tree[0].children[0].id).toBe('child')
    expect(tree[0].children[0].children[0].id).toBe('grandchild')
  })

  it('keeps sibling order as encountered', () => {
    const root = makeNode({ id: 'root' })
    const childA = makeNode({ id: 'a', parent_id: 'root', operation: 'add' })
    const childB = makeNode({ id: 'b', parent_id: 'root', operation: 'sub' })

    const tree = buildTree([root, childA, childB])

    expect(tree[0].children.map((node) => node.id)).toEqual(['a', 'b'])
  })

  it('keeps orphaned nodes as roots', () => {
    const orphan = makeNode({ id: 'orphan', parent_id: 'missing-parent', operation: 'div' })

    const tree = buildTree([orphan])

    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('orphan')
  })

  it('supports multiple roots', () => {
    const firstRoot = makeNode({ id: 'root-1' })
    const secondRoot = makeNode({ id: 'root-2' })

    const tree = buildTree([firstRoot, secondRoot])

    expect(tree.map((node) => node.id)).toEqual(['root-1', 'root-2'])
  })
})

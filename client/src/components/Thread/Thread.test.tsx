import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { UseQueryResult } from '@tanstack/react-query'
import '@testing-library/jest-dom/vitest'

import type { ApiError } from '../../types/api.types'
import type { NodeDto } from '../../types/node.types'
import { Thread } from './index'

vi.mock('../../hooks/useNodes', () => ({
  useNodes: vi.fn(),
}))

import { useNodes } from '../../hooks/useNodes'

function makeNode(overrides: Partial<NodeDto>): NodeDto {
  const id = overrides.id ?? crypto.randomUUID()

  return {
    id,
    author_id: 'author-1',
    parent_id: null,
    operation: 'none',
    operand: 10,
    result: 10,
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

describe('Thread', () => {
  it('renders loading skeleton while query is pending', () => {
    vi.mocked(useNodes).mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
    } as UseQueryResult<NodeDto[], ApiError>)

    render(<Thread />)

    expect(screen.getByTestId('thread-loading')).toBeInTheDocument()
  })

  it('renders error state and retries query', async () => {
    const refetch = vi.fn()
    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: true,
      error: { message: 'Boom', statusCode: 500 },
      data: undefined,
      refetch,
    } as unknown as UseQueryResult<NodeDto[], ApiError>)

    const { user } = await import('@testing-library/user-event').then((module) => ({
      user: module.default.setup(),
    }))

    render(<Thread />)

    expect(screen.getByText('Failed to load thread.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('renders recursive nodes with required fields', () => {
    const root = makeNode({ id: 'root', operation: 'none', parent_id: null, result: 20 })
    const child = makeNode({
      id: 'child',
      parent_id: 'root',
      operation: 'add',
      operand: 5,
      result: 25,
      author: { id: 'author-2', username: 'bob', avatar_url: null },
    })
    const grandchild = makeNode({
      id: 'grandchild',
      parent_id: 'child',
      operation: 'mul',
      operand: 2,
      result: 50,
      author: { id: 'author-3', username: 'carol', avatar_url: null },
    })

    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      data: [root, child, grandchild],
    } as UseQueryResult<NodeDto[], ApiError>)

    render(<Thread />)

    expect(screen.getByText('Result: 20')).toBeInTheDocument()
    expect(screen.getByText('Operation: none 10')).toBeInTheDocument()
    expect(screen.getByText('By: alice')).toBeInTheDocument()
    expect(screen.getAllByText(/Created:/)).toHaveLength(3)
    expect(screen.getAllByText('Children: 1')).toHaveLength(2)

    expect(screen.getByText('Result: 25')).toBeInTheDocument()
    expect(screen.getByText('Operation: + 5')).toBeInTheDocument()
    expect(screen.getByText('By: bob')).toBeInTheDocument()
    expect(screen.getByText('Result: 50')).toBeInTheDocument()
    expect(screen.getByText('Operation: × 2')).toBeInTheDocument()
    expect(screen.getByText('By: carol')).toBeInTheDocument()
    expect(screen.getByText('Children: 0')).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /reply/i })).not.toBeInTheDocument()
  })
})

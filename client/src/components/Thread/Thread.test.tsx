import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { UseQueryResult } from '@tanstack/react-query'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

import type { ApiError } from '../../types/api.types'
import type { NodeDto } from '../../types/node.types'
import { Thread } from './index'

vi.mock('../../hooks/useNodes', () => ({
  useNodes: vi.fn(),
  useCreateRootNode: vi.fn(),
  useReplyToNode: vi.fn(),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../hooks/useAuth'
import { useCreateRootNode, useNodes, useReplyToNode } from '../../hooks/useNodes'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

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
  function setupDefaultAuth(isAuthenticated: boolean): void {
    vi.mocked(useAuth).mockReturnValue({
      token: isAuthenticated ? 'token' : null,
      user: isAuthenticated ? { id: 'user-1', username: 'alice', avatar_url: null } : null,
      isAuthenticated,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })
  }

  function setupMutations(): {
    createRootMutateAsync: ReturnType<typeof vi.fn>
    replyMutateAsync: ReturnType<typeof vi.fn>
  } {
    const createRootMutateAsync = vi.fn().mockResolvedValue(undefined)
    const replyMutateAsync = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useCreateRootNode).mockReturnValue({
      mutateAsync: createRootMutateAsync,
      isPending: false,
    } as never)
    vi.mocked(useReplyToNode).mockReturnValue({
      mutateAsync: replyMutateAsync,
      isPending: false,
    } as never)

    return { createRootMutateAsync, replyMutateAsync }
  }

  it('renders loading skeleton while query is pending', () => {
    setupDefaultAuth(true)
    setupMutations()
    vi.mocked(useNodes).mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
    } as UseQueryResult<NodeDto[], ApiError>)

    render(<Thread onRequireAuth={vi.fn()} />)

    expect(screen.getByTestId('thread-loading')).toBeInTheDocument()
  })

  it('renders error state and retries query', async () => {
    setupDefaultAuth(true)
    setupMutations()
    const refetch = vi.fn()
    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: true,
      error: { message: 'Boom', statusCode: 500 },
      data: undefined,
      refetch,
    } as unknown as UseQueryResult<NodeDto[], ApiError>)

    const user = userEvent.setup()

    render(<Thread onRequireAuth={vi.fn()} />)

    expect(screen.getByText('Failed to load thread.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('renders recursive nodes with required fields', () => {
    setupDefaultAuth(true)
    setupMutations()
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

    render(<Thread onRequireAuth={vi.fn()} />)

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

    expect(screen.getAllByRole('button', { name: /reply/i })).toHaveLength(3)
  })

  it('submits root node payload when authenticated', async () => {
    setupDefaultAuth(true)
    const { createRootMutateAsync } = setupMutations()
    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      data: [],
    } as UseQueryResult<NodeDto[], ApiError>)
    const user = userEvent.setup()

    render(<Thread onRequireAuth={vi.fn()} />)

    const rootHeading = screen.getByRole('heading', { name: 'Create Root Node' })
    const rootForm = rootHeading.closest('div')
    if (!rootForm) {
      throw new Error('Root form container not found')
    }
    await user.type(within(rootForm).getByLabelText('Operand'), '15')
    await user.click(screen.getByRole('button', { name: 'Create root' }))

    expect(createRootMutateAsync).toHaveBeenCalledWith({ operand: 15 })
  })

  it('opens auth modal callback instead of submitting when unauthenticated', async () => {
    setupDefaultAuth(false)
    const { createRootMutateAsync } = setupMutations()
    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      data: [],
    } as UseQueryResult<NodeDto[], ApiError>)
    const onRequireAuth = vi.fn()
    const user = userEvent.setup()

    render(<Thread onRequireAuth={onRequireAuth} />)

    const rootHeading = screen.getByRole('heading', { name: 'Create Root Node' })
    const rootForm = rootHeading.closest('div')
    if (!rootForm) {
      throw new Error('Root form container not found')
    }
    await user.type(within(rootForm).getByLabelText('Operand'), '15')
    await user.click(screen.getByRole('button', { name: 'Create root' }))

    expect(onRequireAuth).toHaveBeenCalledTimes(1)
    expect(createRootMutateAsync).not.toHaveBeenCalled()
  })

  it('renders inline reply form and submits when reply clicked', async () => {
    setupDefaultAuth(true)
    const { replyMutateAsync } = setupMutations()
    const root = makeNode({ id: 'root', operation: 'none', parent_id: null, result: 20 })
    vi.mocked(useNodes).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      data: [root],
    } as UseQueryResult<NodeDto[], ApiError>)
    const user = userEvent.setup()

    render(<Thread onRequireAuth={vi.fn()} />)

    await user.click(screen.getAllByRole('button', { name: /^Reply$/ })[0])
    expect(screen.getByRole('button', { name: 'Submit reply' })).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Operation'), 'add')
    const allOperands = screen.getAllByLabelText('Operand')
    await user.type(allOperands[1], '4')
    await user.click(screen.getByRole('button', { name: 'Submit reply' }))

    expect(replyMutateAsync).toHaveBeenCalledWith({
      nodeId: 'root',
      payload: { operation: 'add', operand: 4 },
    })
  })
})

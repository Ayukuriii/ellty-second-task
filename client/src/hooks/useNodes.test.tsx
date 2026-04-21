import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from './queryKeys'
import { useCreateRootNode, useNodes, useReplyToNode } from './useNodes'
import type { NodeDto } from '../types/node.types'

vi.mock('../api/nodes', () => ({
  getNodes: vi.fn(),
  getSubtree: vi.fn(),
  createRootNode: vi.fn(),
  replyToNode: vi.fn(),
}))

import { createRootNode, getNodes, replyToNode } from '../api/nodes'

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('useNodes hooks', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads nodes data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const nodes: NodeDto[] = [
      {
        id: '1',
        author_id: 'author-1',
        parent_id: null,
        operation: 'none',
        operand: 2,
        result: 2,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
        author: { id: 'author-1', username: 'alice', avatar_url: null },
      },
    ]

    vi.mocked(getNodes).mockResolvedValueOnce(nodes)

    const { result } = renderHook(() => useNodes(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(nodes)
  })

  it('invalidates node list after create root success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    vi.mocked(createRootNode).mockResolvedValueOnce({} as NodeDto)

    const { result } = renderHook(() => useCreateRootNode(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({ operand: 4 })

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.nodes }),
    )
  })

  it('invalidates nodes and subtree after reply success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.mocked(replyToNode).mockResolvedValueOnce({} as NodeDto)

    const { result } = renderHook(() => useReplyToNode(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      nodeId: 'parent-id',
      payload: { operation: 'add', operand: 10 },
    })

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.nodes }),
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.subtree('parent-id'),
    })
  })
})

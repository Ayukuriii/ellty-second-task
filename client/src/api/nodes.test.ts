import { AxiosError } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from './client'
import { getNodes } from './nodes'
import type { NodeDto } from '../types/node.types'

describe('nodes api helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns data from success envelope', async () => {
    const nodes: NodeDto[] = [
      {
        id: '1',
        author_id: 'author-1',
        parent_id: null,
        operation: 'none',
        operand: 3,
        result: 3,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
        author: { id: 'author-1', username: 'alice', avatar_url: null },
      },
    ]

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { message: 'ok', data: nodes },
    } as never)

    await expect(getNodes()).resolves.toEqual(nodes)
  })

  it('normalizes validation errors and preserves errors payload', async () => {
    const validationPayload = {
      message: 'Validation failed',
      errors: { fieldErrors: { operand: ['Required'] }, formErrors: [] },
    }

    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(
      new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: { headers: {} } as never,
          data: validationPayload,
        },
      ),
    )

    await expect(getNodes()).rejects.toMatchObject({
      message: 'Validation failed',
      errors: validationPayload.errors,
    })
  })
})

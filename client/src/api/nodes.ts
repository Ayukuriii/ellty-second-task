import { apiClient } from './client'
import { toApiError } from './errors'
import type { ApiSuccess } from '../types/api.types'
import type { CreateReplyPayload, CreateRootPayload, NodeDto } from '../types/node.types'

export async function getNodes(): Promise<NodeDto[]> {
  try {
    const response = await apiClient.get<ApiSuccess<NodeDto[]>>('/nodes')
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getSubtree(nodeId: string): Promise<NodeDto[]> {
  try {
    const response = await apiClient.get<ApiSuccess<NodeDto[]>>(`/nodes/${nodeId}/subtree`)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createRootNode(payload: CreateRootPayload): Promise<NodeDto> {
  try {
    const response = await apiClient.post<ApiSuccess<NodeDto>>('/nodes', payload)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function replyToNode(nodeId: string, payload: CreateReplyPayload): Promise<NodeDto> {
  try {
    const response = await apiClient.post<ApiSuccess<NodeDto>>(`/nodes/${nodeId}/reply`, payload)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}

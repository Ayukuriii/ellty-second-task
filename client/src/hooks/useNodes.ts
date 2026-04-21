import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'

import { createRootNode, getNodes, getSubtree, replyToNode } from '../api/nodes'
import type { ApiError } from '../types/api.types'
import type { CreateReplyPayload, CreateRootPayload, NodeDto } from '../types/node.types'
import { queryKeys } from './queryKeys'

export function useNodes(): UseQueryResult<NodeDto[], ApiError> {
  return useQuery<NodeDto[], ApiError>({
    queryKey: queryKeys.nodes,
    queryFn: getNodes,
  })
}

export function useNodeSubtree(nodeId: string): UseQueryResult<NodeDto[], ApiError> {
  return useQuery<NodeDto[], ApiError>({
    queryKey: queryKeys.subtree(nodeId),
    queryFn: () => getSubtree(nodeId),
    enabled: nodeId.trim().length > 0,
  })
}

export function useCreateRootNode(): UseMutationResult<NodeDto, ApiError, CreateRootPayload> {
  const queryClient = useQueryClient()

  return useMutation<NodeDto, ApiError, CreateRootPayload>({
    mutationFn: createRootNode,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.nodes })
    },
  })
}

interface ReplyMutationInput {
  nodeId: string
  payload: CreateReplyPayload
}

export function useReplyToNode(): UseMutationResult<NodeDto, ApiError, ReplyMutationInput> {
  const queryClient = useQueryClient()

  return useMutation<NodeDto, ApiError, ReplyMutationInput>({
    mutationFn: ({ nodeId, payload }: ReplyMutationInput) => replyToNode(nodeId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.nodes }),
        queryClient.invalidateQueries({ queryKey: queryKeys.subtree(variables.nodeId) }),
      ])
    },
  })
}

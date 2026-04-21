import type { JSX } from 'react'
import { useState } from 'react'

import { useAuth } from '../../hooks/useAuth'
import { useCreateRootNode, useNodes, useReplyToNode } from '../../hooks/useNodes'
import type { CreateReplyPayload, CreateRootPayload } from '../../types/node.types'
import { buildTree } from '../../utils/buildTree'
import { CommentNode } from '../CommentNode'
import { ReplyForm } from '../ReplyForm'
import type { ThreadProps } from './Thread.types'

export function Thread({ className, onRequireAuth }: ThreadProps): JSX.Element {
  const { data, isPending, isError, refetch } = useNodes()
  const { isAuthenticated } = useAuth()
  const createRootMutation = useCreateRootNode()
  const replyMutation = useReplyToNode()
  const [activeReplyNodeId, setActiveReplyNodeId] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string>('')

  function toggleReply(nodeId: string): void {
    setSubmissionError('')
    setActiveReplyNodeId((current) => (current === nodeId ? null : nodeId))
  }

  async function handleRootSubmit(payload: CreateRootPayload): Promise<void> {
    setSubmissionError('')
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }

    try {
      await createRootMutation.mutateAsync(payload)
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Failed to create root node')
    }
  }

  async function handleReplySubmit(nodeId: string, payload: CreateReplyPayload): Promise<void> {
    setSubmissionError('')
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }

    try {
      await replyMutation.mutateAsync({ nodeId, payload })
      setActiveReplyNodeId(null)
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Failed to post reply')
    }
  }

  if (isPending) {
    return (
      <section data-testid="thread-loading" className={className}>
        Loading thread...
      </section>
    )
  }

  if (isError) {
    return (
      <section className={className}>
        <p>Failed to load thread.</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </section>
    )
  }

  const tree = buildTree(data ?? [])

  return (
    <section className={className}>
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Create Root Node</h2>
        <ReplyForm
          mode="root"
          submitLabel="Create root"
          isSubmitting={createRootMutation.isPending}
          onSubmit={handleRootSubmit}
        />
      </div>
      {submissionError ? (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {submissionError}
        </p>
      ) : null}
      <ul className="space-y-3">
        {tree.map((node) => (
          <CommentNode
            key={node.id}
            node={node}
            depth={0}
            activeReplyNodeId={activeReplyNodeId}
            onReplyClick={toggleReply}
            renderReplyForm={(nodeId) => (
              <ReplyForm
                mode="reply"
                submitLabel="Submit reply"
                isSubmitting={replyMutation.isPending && activeReplyNodeId === nodeId}
                onSubmit={(payload) => handleReplySubmit(nodeId, payload)}
              />
            )}
          />
        ))}
      </ul>
    </section>
  )
}

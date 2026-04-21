import type { JSX } from 'react'

import { useNodes } from '../../hooks/useNodes'
import { buildTree } from '../../utils/buildTree'
import { CommentNode } from '../CommentNode'
import type { ThreadProps } from './Thread.types'

export function Thread({ className }: ThreadProps): JSX.Element {
  const { data, isPending, isError, refetch } = useNodes()

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
      <ul className="space-y-3">
        {tree.map((node) => (
          <CommentNode key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </section>
  )
}

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { TreeNode } from '../../types/node.types'
import { CommentNode } from './index'

function makeTreeNode(overrides: Partial<TreeNode>): TreeNode {
  return {
    id: overrides.id ?? 'node-1',
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
    children: [],
    ...overrides,
  }
}

describe('CommentNode', () => {
  it('calls onReplyClick with node id', async () => {
    const onReplyClick = vi.fn()
    const user = userEvent.setup()
    const node = makeTreeNode({ id: 'root' })

    render(
      <CommentNode
        node={node}
        depth={0}
        activeReplyNodeId={null}
        onReplyClick={onReplyClick}
        renderReplyForm={() => null}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reply' }))
    expect(onReplyClick).toHaveBeenCalledWith('root')
  })

  it('renders reply form slot only for active node', () => {
    const node = makeTreeNode({ id: 'root' })

    const { rerender } = render(
      <CommentNode
        node={node}
        depth={0}
        activeReplyNodeId={null}
        onReplyClick={vi.fn()}
        renderReplyForm={() => <div>Reply form slot</div>}
      />,
    )

    expect(screen.queryByText('Reply form slot')).not.toBeInTheDocument()

    rerender(
      <CommentNode
        node={node}
        depth={0}
        activeReplyNodeId="root"
        onReplyClick={vi.fn()}
        renderReplyForm={() => <div>Reply form slot</div>}
      />,
    )

    expect(screen.getByText('Reply form slot')).toBeInTheDocument()
  })
})

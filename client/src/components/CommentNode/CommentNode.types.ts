import type { ReactNode } from 'react'
import type { TreeNode } from '../../types/node.types'

export interface CommentNodeProps {
  node: TreeNode
  depth: number
  activeReplyNodeId: string | null
  onReplyClick: (nodeId: string) => void
  renderReplyForm: (nodeId: string) => ReactNode
}

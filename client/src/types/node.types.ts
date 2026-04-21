export type NodeOperation = 'none' | 'add' | 'sub' | 'mul' | 'div'

export interface Author {
  id: string
  username: string
  avatar_url: string | null
}

export interface NodeDto {
  id: string
  author_id: string
  parent_id: string | null
  operation: NodeOperation
  operand: number
  result: number
  created_at: string
  updated_at: string
  author: Author
}

export interface CreateRootPayload {
  operand: number
}

export interface CreateReplyPayload {
  operation: Exclude<NodeOperation, 'none'>
  operand: number
}

export interface TreeNode extends NodeDto {
  children: TreeNode[]
}

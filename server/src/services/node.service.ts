import type { NodeWithAuthor } from '../models/types/node.types'
import type { Operation } from '../models/types/node.types'
import { NodeRepository } from '../repositories/NodeRepository'
import { AppError } from '../utils/AppError'
import type { CreateReplyBody, CreateRootBody } from '../validation/node.schemas'

function computeResult(
  parentResult: number,
  operation: Exclude<Operation, 'none'>,
  operand: number
): number {
  switch (operation) {
    case 'add':
      return parentResult + operand
    case 'sub':
      return parentResult - operand
    case 'mul':
      return parentResult * operand
    case 'div':
      return parentResult / operand
    default: {
      const _exhaustive: never = operation
      return _exhaustive
    }
  }
}

export class NodeService {
  constructor(private readonly nodes: NodeRepository = new NodeRepository()) {}

  async listNodes(): Promise<NodeWithAuthor[]> {
    return this.nodes.findAllFlat()
  }

  async getSubtree(rootId: string): Promise<NodeWithAuthor[]> {
    const rows = await this.nodes.findSubtreeByRootId(rootId)
    if (rows.length === 0) {
      throw new AppError('Node not found', 404)
    }
    return rows
  }

  async createRoot(
    userId: string,
    username: string,
    body: CreateRootBody
  ): Promise<NodeWithAuthor> {
    const row = await this.nodes.insert({
      author_id: userId,
      parent_id: null,
      operation: 'none',
      operand: body.operand,
      result: body.operand,
    })
    return {
      ...row,
      author: { id: userId, username, avatar_url: null },
    }
  }

  async createReply(
    userId: string,
    username: string,
    parentId: string,
    body: CreateReplyBody
  ): Promise<NodeWithAuthor> {
    if (body.operation === 'div' && body.operand === 0) {
      throw new AppError('Cannot divide by zero', 400)
    }
    const parent = await this.nodes.findById(parentId)
    if (parent === null) {
      throw new AppError('Parent node not found', 404)
    }
    const result = computeResult(parent.result, body.operation, body.operand)
    if (!Number.isFinite(result)) {
      throw new AppError('Result is not a finite number', 400)
    }
    const row = await this.nodes.insert({
      author_id: userId,
      parent_id: parentId,
      operation: body.operation,
      operand: body.operand,
      result,
    })
    return {
      ...row,
      author: { id: userId, username, avatar_url: null },
    }
  }
}

export const nodeService = new NodeService()

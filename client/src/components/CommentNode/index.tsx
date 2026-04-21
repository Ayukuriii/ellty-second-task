import type { JSX } from 'react'

import type { NodeOperation } from '../../types/node.types'
import type { CommentNodeProps } from './CommentNode.types'

function formatOperation(operation: NodeOperation): string {
  switch (operation) {
    case 'add':
      return '+'
    case 'sub':
      return '-'
    case 'mul':
      return '×'
    case 'div':
      return '÷'
    case 'none':
    default:
      return 'none'
  }
}

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return createdAt
  }

  return date.toISOString()
}

export function CommentNode({ node, depth }: CommentNodeProps): JSX.Element {
  return (
    <li
      style={{ marginLeft: `${depth * 16}px` }}
      className="rounded border border-slate-200 bg-white p-3"
    >
      <p>Result: {node.result}</p>
      <p>
        Operation: {formatOperation(node.operation)} {node.operand}
      </p>
      <p>By: {node.author.username}</p>
      <p>Created: {formatCreatedAt(node.created_at)}</p>
      <p>Children: {node.children.length}</p>

      {node.children.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <CommentNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

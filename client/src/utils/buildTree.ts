import type { NodeDto, TreeNode } from '../types/node.types'

export function buildTree(nodes: NodeDto[]): TreeNode[] {
  const byId = new Map<string, TreeNode>()
  const roots: TreeNode[] = []

  for (const node of nodes) {
    byId.set(node.id, { ...node, children: [] })
  }

  for (const node of nodes) {
    const treeNode = byId.get(node.id)

    if (!treeNode) {
      continue
    }

    if (!node.parent_id) {
      roots.push(treeNode)
      continue
    }

    const parent = byId.get(node.parent_id)

    if (!parent) {
      // Orphan fallback: if parent is missing from the payload, keep node visible as root.
      roots.push(treeNode)
      continue
    }

    parent.children.push(treeNode)
  }

  return roots
}

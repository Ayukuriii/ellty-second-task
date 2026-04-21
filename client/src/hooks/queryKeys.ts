export const queryKeys = {
  nodes: ['nodes'] as const,
  subtree: (nodeId: string) => ['nodes', 'subtree', nodeId] as const,
}

export type Operation = 'none' | 'add' | 'sub' | 'mul' | 'div';

/** Raw row shape as stored in the `nodes` table */
export interface NodeRow {
  id: string;               // UUID
  author_id: string;        // FK → users.id
  parent_id: string | null; // null = root node
  operation: Operation;     // 'none' for root nodes
  operand: number;          // user-chosen right-hand number
  result: number;           // computed at write time: parent.result OP operand
  created_at: Date;
}

/** Shape for inserting a new node */
export type NewNodeRow = Omit<NodeRow, 'id' | 'created_at'>;

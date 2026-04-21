import type { CreateReplyPayload, CreateRootPayload } from '../../types/node.types'

export type ReplyFormMode = 'root' | 'reply'

export interface ReplyFormBaseProps {
  submitLabel: string
  isSubmitting?: boolean
}

export interface RootReplyFormProps extends ReplyFormBaseProps {
  mode: 'root'
  onSubmit: (payload: CreateRootPayload) => Promise<void>
}

export interface ChildReplyFormProps extends ReplyFormBaseProps {
  mode: 'reply'
  onSubmit: (payload: CreateReplyPayload) => Promise<void>
}

export type ReplyFormProps = RootReplyFormProps | ChildReplyFormProps

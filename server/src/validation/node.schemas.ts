import { z } from 'zod'

const finiteNumber = z.number().refine((n) => Number.isFinite(n), {
  message: 'Must be a finite number',
})

const maxTenDigits = finiteNumber.refine((n) => {
  const digitsOnly = Math.trunc(Math.abs(n)).toString().replace(/^0+/, '')
  const normalizedDigits = digitsOnly.length === 0 ? '0' : digitsOnly
  return normalizedDigits.length <= 10
}, {
  message: 'Must be at most 10 digits',
})

export const createRootBodySchema = z.object({
  operand: maxTenDigits,
})

export type CreateRootBody = z.infer<typeof createRootBodySchema>

const replyOperationSchema = z.enum(['add', 'sub', 'mul', 'div'])

export const createReplyBodySchema = z.object({
  operation: replyOperationSchema,
  operand: finiteNumber,
})

export type CreateReplyBody = z.infer<typeof createReplyBodySchema>

export const nodeIdParamSchema = z.object({
  id: z.string().uuid(),
})

export type NodeIdParams = z.infer<typeof nodeIdParamSchema>

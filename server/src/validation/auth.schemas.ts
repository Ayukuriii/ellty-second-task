import { z } from 'zod'

const username = z.string().trim().min(1).max(50)
const password = z.string().min(8)

export const registerBodySchema = z.object({
  username,
  password,
})

export const loginBodySchema = z.object({
  username,
  password,
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type LoginBody = z.infer<typeof loginBodySchema>

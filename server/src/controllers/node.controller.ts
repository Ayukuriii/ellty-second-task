import type { Request, Response } from 'express'
import { nodeService } from '../services/node.service'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/apiResponse'
import { AppError } from '../utils/AppError'
import type { NodeIdParams } from '../validation/node.schemas'

export const listNodes = asyncHandler(async (_req: Request, res: Response) => {
  const data = await nodeService.listNodes()
  sendSuccess(res, 200, 'Nodes list retrieved successfully', data)
})

export const getSubtree = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as NodeIdParams
  const data = await nodeService.getSubtree(id)
  sendSuccess(res, 200, 'Subtree loaded successfully', data)
})

export const createRoot = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user
  if (user === undefined) {
    throw new AppError('Unauthorized', 401)
  }
  const data = await nodeService.createRoot(user.sub, user.username, req.body)
  sendSuccess(res, 201, 'Root node created successfully', data)
})

export const createReply = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user
  if (user === undefined) {
    throw new AppError('Unauthorized', 401)
  }
  const { id } = req.params as unknown as NodeIdParams
  const data = await nodeService.createReply(user.sub, user.username, id, req.body)
  sendSuccess(res, 201, 'Reply created successfully', data)
})

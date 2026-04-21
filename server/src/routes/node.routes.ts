import { Router } from 'express'
import * as nodeController from '../controllers/node.controller'
import { authenticate } from '../middleware/authenticate'
import { validateBody } from '../middleware/validateBody'
import { validateParams } from '../middleware/validateParams'
import {
  createReplyBodySchema,
  createRootBodySchema,
  nodeIdParamSchema,
} from '../validation/node.schemas'

export const nodeRouter = Router()

nodeRouter.get('/', nodeController.listNodes)
nodeRouter.get(
  '/:id/subtree',
  validateParams(nodeIdParamSchema),
  nodeController.getSubtree
)
nodeRouter.post(
  '/',
  authenticate,
  validateBody(createRootBodySchema),
  nodeController.createRoot
)
nodeRouter.post(
  '/:id/reply',
  authenticate,
  validateParams(nodeIdParamSchema),
  validateBody(createReplyBodySchema),
  nodeController.createReply
)

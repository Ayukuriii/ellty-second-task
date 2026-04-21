import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { validateBody } from '../middleware/validateBody'
import { loginBodySchema, registerBodySchema } from '../validation/auth.schemas'

export const authRouter = Router()

authRouter.post(
  '/register',
  validateBody(registerBodySchema),
  authController.register
)
authRouter.post('/login', validateBody(loginBodySchema), authController.login)

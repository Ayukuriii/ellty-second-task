import { Router } from 'express'
import { authRouter } from './auth.routes'
import { nodeRouter } from './node.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/nodes', nodeRouter)

import { env } from './config/env'
import { createApp } from './app'
import { logger } from './utils/logger'

const app = createApp()
const port = Number(env.PORT)

app.listen(port, () => {
  logger.info({ port }, 'Server listening')
})

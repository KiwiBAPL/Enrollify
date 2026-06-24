import 'dotenv/config'
import { createApp } from './app.js'
import { createContainer } from './container.js'
import { loadEnv } from './config/env.js'

const env = loadEnv()
const container = createContainer(env)
const app = createApp(container)

app.listen(env.PORT, () => {
  container.logger.info({ port: env.PORT }, 'Enrollify AI backend listening')
})

export { container }

import fastify from 'fastify'
import cors from '@fastify/cors'

import autoload from '@fastify/autoload'
import path from 'path'

async function startup (): Promise<void> {
  const server = fastify({
    logger: true
  })

  // !! Cors liberated to all users
  await server.register(cors, {
    origin: true
  })

  // Server routes
  server.register(autoload, {
    dir: path.join(__dirname, 'routes')
  })

  await server.listen({ port: 3333 /* host: '0.0.0.0' */ })
}

startup()

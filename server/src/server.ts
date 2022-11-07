import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

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

  // Change it to a .env
  await server.register(jwt, {
    secret: 'x049fj458bm302nc9hnmt93nv96tmopaspq0env894nf893odx'
  })

  // Server routes
  server.register(autoload, {
    dir: path.join(__dirname, 'routes')
  })

  await server.listen({ port: 3333, host: '0.0.0.0' })
}

startup()

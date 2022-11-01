import fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query']
})

async function startup (): Promise<void> {
  const server = fastify({
    logger: true
  })

  // !! WARNING - CORS ENABLED TO ALL
  await server.register(cors, {
    origin: true
  })

  // Counts every pool registered to the database
  server.get('/pools/count', async () => {
    const count = await prisma.pool.count({})

    return { count }
  })

  await server.listen({ port: 3333, host: '0.0.0.0' })
}

startup()

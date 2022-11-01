import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query']
})

async function startup (): Promise<void> {
  const fastifyServer = fastify({
    logger: true
  })

  // Counts every pool registered to the database
  fastifyServer.get('/pools/count', async () => {
    const count = await prisma.pool.count({})

    return { count }
  })

  await fastifyServer.listen({ port: 3000 })
}

startup()

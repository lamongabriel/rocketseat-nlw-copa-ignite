import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '@prisma/client'

import { z } from 'zod'
import ShortUniqueID from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query']
})

export async function CountEveryPool (request: FastifyRequest, reply: FastifyReply) {
  const count = await prisma.pool.count({})

  return { count }
}

export async function CreateNewPool (request: FastifyRequest, reply: FastifyReply) {
  try {
    const createPoolBody = z.object({
      title: z.string().trim().min(5)
    })

    const { title } = createPoolBody.parse(request.body)
    const generateID = new ShortUniqueID({ length: 6 })
    const code = String(generateID()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })

    return await reply.status(201).send({ pool: code })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return await reply.status(400).send(err.format())
    }
  }
}
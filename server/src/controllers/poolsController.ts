import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

import { z } from 'zod'
import ShortUniqueID from 'short-unique-id'

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

    try {
      request.jwtVerify()

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code
        }
      })
    }

    return await reply.status(201).send({ pool: code })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return await reply.status(400).send(err.format())
    }
  }
}

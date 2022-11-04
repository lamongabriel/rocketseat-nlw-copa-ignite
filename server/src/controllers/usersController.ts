import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function CountEveryUser (request: FastifyRequest, reply: FastifyReply) {
  const count = await prisma.user.count({})

  return { count }
}

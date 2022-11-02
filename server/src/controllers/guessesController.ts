import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query']
})

export async function CountEveryGuess (request: FastifyRequest, reply: FastifyReply) {
  const count = await prisma.guess.count({})

  return { count }
}

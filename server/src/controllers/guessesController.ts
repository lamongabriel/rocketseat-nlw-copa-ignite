import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function CountEveryGuess (request: FastifyRequest, reply: FastifyReply) {
  const count = await prisma.guess.count({})

  return { count }
}

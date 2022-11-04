import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

import { z } from 'zod'

export async function ListMatches (request: FastifyRequest, reply: FastifyReply) {
  const getPoolParams = z.object({
    id: z.string()
  })

  const { id } = getPoolParams.parse(request.params)

  const matches = await prisma.match.findMany({
    orderBy: {
      date: 'desc'
    },
    include: {
      guesses: {
        where: {
          participant: {
            userId: request.user.sub,
            poolId: id
          }
        }
      }
    }
  })

  return {
    matches: matches.map(match => {
      return {
        ...match,
        guess: match.guesses.length > 0 ? match.guesses[0] : null,
        guesses: undefined
      }
    })
  }
}

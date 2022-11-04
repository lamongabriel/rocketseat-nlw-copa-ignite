import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function CountEveryGuess (request: FastifyRequest, reply: FastifyReply) {
  const count = await prisma.guess.count({})

  return { count }
}

export async function CreateGuess (request: FastifyRequest, reply: FastifyReply) {
  const createGuessParams = z.object({
    poolId: z.string(),
    matchId: z.string()
  })

  const createGuesBody = z.object({
    firstTeamGoals: z.number(),
    secondTeamGoals: z.number()
  })

  const { poolId, matchId } = createGuessParams.parse(request.params)
  const { firstTeamGoals, secondTeamGoals } = createGuesBody.parse(request.body)

  const participant = await prisma.participant.findUnique({
    where: {
      userId_poolId: {
        poolId,
        userId: request.user.sub
      }
    }
  })

  if (!participant) {
    return await reply.status(400).send({
      message: 'You are not allowed to guess inside this pool'
    })
  }

  const guess = await prisma.guess.findUnique({
    where: {
      participantId_matchId: {
        participantId: participant.id,
        matchId
      }
    }
  })

  if (guess) {
    return await reply.status(400).send({
      message: 'You already made a guess to this game on this pool'
    })
  }

  const match = await prisma.match.findUnique({
    where: {
      id: matchId
    }
  })

  if (!match) {
    return await reply.status(400).send({
      message: 'Game not found'
    })
  }

  if (match.date < new Date()) {
    return await reply.status(400).send({
      message: 'You cannot send guesses after the game started'
    })
  }

  await prisma.guess.create({
    data: {
      matchId,
      participantId: participant.id,
      firstTeamGoalsQuantity: firstTeamGoals,
      secondTeamGoalsQuantity: secondTeamGoals
    }
  })

  return await reply.status(201).send()
}

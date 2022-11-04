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

export async function JoinNewPool (request: FastifyRequest, reply: FastifyReply) {
  const joinPoolBody = z.object({
    code: z.string().length(6)
  })

  const { code } = joinPoolBody.parse(request.body)

  const poolToJoin = await prisma.pool.findUnique({
    where: {
      code
    },
    include: {
      participants: {
        where: {
          userId: request.user.sub
        }
      }
    }
  })

  if (!poolToJoin) {
    return await reply.status(400).send({
      message: 'Pool not found'
    })
  }

  if (poolToJoin.participants.length > 0) {
    return await reply.status(400).send({
      message: 'You already joined this pool.'
    })
  }

  if (!poolToJoin.ownerId) {
    await prisma.pool.update({
      where: {
        id: poolToJoin.id
      },
      data: {
        ownerId: request.user.sub
      }
    })
  }

  prisma.participant.create({
    data: {
      poolId: poolToJoin.id,
      userId: request.user.sub
    }
  })

  return await reply.status(201).send()
}

export async function ListJoinedPools (request: FastifyRequest, reply: FastifyReply) {
  const pools = await prisma.pool.findMany({
    where: {
      participants: {
        some: {
          userId: request.user.sub
        }
      }
    },
    include: {
      _count: {
        select: {
          participants: true
        }
      },
      participants: {
        select: {
          id: true,
          user: {
            select: {
              avatarUrl: true
            }
          }
        },
        take: 4
      },
      owner: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return { pools }
}

export async function ListPoolInfo (request: FastifyRequest, reply: FastifyReply) {
  const getPoolParams = z.object({
    id: z.string()
  })

  const { id } = getPoolParams.parse(request.params)

  const pool = await prisma.pool.findUnique({
    where: {
      id
    },
    include: {
      _count: {
        select: {
          participants: true
        }
      },
      participants: {
        select: {
          id: true,
          user: {
            select: {
              avatarUrl: true
            }
          }
        },
        take: 4
      },
      owner: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return { pool }
}

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

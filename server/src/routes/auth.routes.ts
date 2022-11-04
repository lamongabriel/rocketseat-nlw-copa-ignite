import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

async function routes (fastify: FastifyInstance) {
  // [GET] - Return user info
  fastify.get('/me', { onRequest: [authenticate] }, async (request) => {
    return { user: request.user }
  })

  // [POST] - Authenticates user via google OAuth2 token
  fastify.post('/users', async (request, reply) => {
    try {
      const createUserBody = z.object({
        accessToken: z.string()
      })

      const { accessToken } = createUserBody.parse(request.body)
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const userData = await userResponse.json()

      const userInfoSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url()
      })

      const userInfo = userInfoSchema.parse(userData)

      let user = await prisma.user.findUnique({
        where: {
          googleId: userInfo.id
        }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userInfo.name,
            email: userInfo.email,
            googleId: userInfo.id,
            avatarUrl: userInfo.picture
          }
        })
      }

      const token = fastify.jwt.sign({
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      {
        sub: user.id,
        expiresIn: '7 days'
      })

      return { token }
    } catch (error) {
      return await reply.status(400).send(error)
    }
  })
}

export default routes

import { FastifyInstance } from 'fastify'

import * as usersController from '../controllers/usersController'

async function routes (fastify: FastifyInstance) {
  // [GET] - Counts every user registered to the database
  fastify.get('/users/count', usersController.CountEveryUser)
}

export default routes

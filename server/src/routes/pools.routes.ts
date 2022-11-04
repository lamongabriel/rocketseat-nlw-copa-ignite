import { FastifyInstance } from 'fastify'

import * as poolsController from '../controllers/poolsController'
import { authenticate } from '../plugins/authenticate'

async function routes (fastify: FastifyInstance) {
  // [GET] - Counts every pool registered to the database
  fastify.get('/pools/count', poolsController.CountEveryPool)

  // [GET] - List all pools of the user
  fastify.get('/pools', { onRequest: [authenticate] }, poolsController.ListJoinedPools)

  // [GET] - List a specific pool information
  fastify.get('/pools/:id', { onRequest: [authenticate] }, poolsController.ListPoolInfo)

  // [POST] - Creates a new pool to the database
  fastify.post('/pools', poolsController.CreateNewPool)

  // [POST] - Enters a new pool
  fastify.post('/pools/join', { onRequest: [authenticate] }, poolsController.JoinNewPool)
}

export default routes

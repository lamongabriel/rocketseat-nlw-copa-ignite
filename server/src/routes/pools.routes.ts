import { FastifyInstance } from 'fastify'

import * as poolsController from '../controllers/poolsController'

async function routes (fastify: FastifyInstance) {
  // [GET] - Counts every pool registered to the database
  fastify.get('/pools/count', poolsController.CountEveryPool)
  // [POST] - Creates a new pool to the database
  fastify.post('/pools', poolsController.CreateNewPool)
}

export default routes

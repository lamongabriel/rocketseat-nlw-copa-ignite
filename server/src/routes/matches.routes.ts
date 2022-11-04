import { FastifyInstance } from 'fastify'

import * as matchesController from '../controllers/matchesController'
import { authenticate } from '../plugins/authenticate'

async function routes (fastify: FastifyInstance) {
  // [GET] - List a specific pool matches list
  fastify.get('/pools/:id/matches', { onRequest: [authenticate] }, matchesController.ListMatches)
}

export default routes

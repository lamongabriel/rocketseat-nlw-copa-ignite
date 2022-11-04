import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'

import * as guessesController from '../controllers/guessesController'

async function routes (fastify: FastifyInstance) {
  // [GET] - Counts every guess registered to the database
  fastify.get('/guesses/count', guessesController.CountEveryGuess)

  fastify.post('/pools/:poolId/matches/:matchId/guesses', { onRequest: [authenticate] }, guessesController.CreateGuess)
}

export default routes

import { FastifyInstance } from 'fastify'

import * as guessesController from '../controllers/guessesController'

async function routes (fastify: FastifyInstance) {
  // [GET] - Counts every guess registered to the database
  fastify.get('/guesses/count', guessesController.CountEveryGuess)
}

export default routes

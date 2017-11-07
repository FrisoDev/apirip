const router = require('express').Router()
const { Game } = require('../models')
const passport = require('../config/auth')

router.get('/games', (req, res, next) => {
    Game.find()
      // Newest games first
      .sort({ createdAt: -1 })
      // Send the data in JSON format
      .then((games) => res.json(games))
      // Throw a 500 error if something goes wrong
      .catch((error) => next(error))
  })
  .get('/games/:id', (req, res, next) => {
    const id = req.params.id
    Game.findById(id)
      .then((game) => {
        if (!game) { return next() }
        res.json(game)
      })
      .catch((error) => next(error))
  })
  .post('/games', passport.authorize('jwt', { session: false }), (req, res, next) => {
    let newGame = req.body
    newGame.authorId = req.account._id

    Game.create(newGame)
      .then((game) => res.json(game))
      .catch((error) => next(error))
  })

module.exports = router

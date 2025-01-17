const { Router } = require('express')
const { ValidationError } = require('sequelize')

const { generateAuthToken, requireAuthentication } = require('../lib/auth')
const { User, UserClientFields, getUserByID, validateUser } = require('../models/user')

const router = Router()

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userId/businesses', requireAuthentication, async function (req, res) {
  const userId = req.params.userId
  const userBusinesses = await Business.findAll({ where: { ownerId: userId }})
  res.status(200).json({
    businesses: userBusinesses
  })
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userId/reviews', requireAuthentication, async function (req, res) {
  const userId = req.params.userId
  const userReviews = await Review.findAll({ where: { userId: userId }})
  res.status(200).json({
    reviews: userReviews
  })
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userId/photos', requireAuthentication, async function (req, res) {
  const userId = req.params.userId
  const userPhotos = await Photo.findAll({ where: { userId: userId }})
  res.status(200).json({
    photos: userPhotos
  })
})

/*
 * Route to fetch info about a specific user.
 * https://stackoverflow.com/questions/27972271/sequelize-dont-return-password
 */
router.get('/:userId', requireAuthentication, async function (req, res, next) {
  const userId = req.params.userId
  const user = await User.scope('withoutPassword').findAll()
  if (user) {
    res.status(200).send(user)
  } else {
    next()
  }
})

/*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body, UserClientFields)
    res.status(201).send({ id: user.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

/*
 * Route to login a reqistered user
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated =
        await validateUser(req.body.email, req.body.password);
      if (authenticated) {
        const token = generateAuthToken(req.body.userId);
        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials."
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "Error logging in. Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body was invalid."
    });
  }
});

module.exports = router

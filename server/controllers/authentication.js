const jwt = require('jwt-simple')
const User = require('../models/user')
const keys = require('../config/dev')

function tokenForUser(user) {
  return jwt.encode({ sub: user.id,
    iat: Math.round(Date.now() / 1000),
    exp: Math.round(Date.now() / 1000 + 5 * 60 * 60)}, keys.TOKEN_SECRET)
}

exports.signin = function(request, response, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  response.send({
    token: tokenForUser(request.user),
    email: request.user.email
  })
}

exports.currentUser = function(request, response) {
  response.send(request.user)
}

exports.signup = function(request, response, next) {
  const email = request.body.email
  const password = request.body.password

  if (!email || !password) {
    return response.status(422).send({ error: 'You must provide email and password'})
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    // If a user with email does exist, return an error
    if (existingUser) {
      return response.status(422).send({ error: 'Email is in use' })
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User()

    user.email = email

    user.setPassword(password)

    user.save(function(err, user) {
      if (err) { return next(err) }

      // Repond to request indicating the user was created
      response.json({ token: tokenForUser(user), email: user.email })
    });
  });
}

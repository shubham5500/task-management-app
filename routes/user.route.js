const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const { authorizedUser } = require('../middleware/auth.middleware');

const userRoute = require("express").Router();

userRoute.get('/profile', authorizedUser, async (req, res) => {
  return res.send('Hello')
})

module.exports = userRoute;

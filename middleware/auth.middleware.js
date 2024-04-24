const jwt = require("jsonwebtoken");
const config = require("config");
const { ErrorHandler } = require("../error/error.helper");
const { db } = require("../db/connection");
const { getUserById } = require("../db/user.db");

async function authorizedUser(req, res, next) {
  next();
  // const token = req.header("auth-token");

  // if (!token) {
  //   throw new ErrorHandler(401, "Token missing");
  // }
  // try {
  //   const { data } = jwt.verify(token, config.get("credentials.token_secret"));
  //   const user = await getUserById(data);
  //   res.user = user;
  //   next();
  // } catch (error) {
  //   throw new ErrorHandler(403, error);
  // }
}

module.exports = {
  authorizedUser,
};

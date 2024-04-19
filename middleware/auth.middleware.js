const jwt = require("jsonwebtoken");
const config = require("config");
const { ErrorHandler } = require("../error/error.helper");
const { db } = require("../db/connection");
const { getUserById } = require("../db/user.db");

async function authorizedUser(req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    throw new ErrorHandler(401, "Token missing");
  }
  try {
    console.log("===>", config.get("credentials.token_secret"), token);

    const { data } = jwt.verify(token, config.get("credentials.token_secret"));
    const user = await getUserById(data.userId);
    res.user = user;
    next();
  } catch (error) {
    throw new ErrorHandler(401, error);
  }
}

module.exports = {
  authorizedUser,
};

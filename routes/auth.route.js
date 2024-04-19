const express = require("express");
const authRoute = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const { creatUser, getUserByKey, getUserById } = require("../db/user.db");
const { omit } = require("lodash");
const { ErrorHandler } = require("../error/error.helper");
const {
  validateUser,
  hashPassword,
  comparePassword,
} = require("../models/user.model");

authRoute.get("/register", async (req, res, next) => {
  const { name, username, email, password } = req.body;
  const { error, value } = validateUser(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error);
  }
  const hashedPassword = await hashPassword(password);
  const user = await creatUser({
    username,
    email,
    password: hashedPassword,
    name,
  });
  const resObj = omit(user, "password");
  return res.status(200).send(resObj);
});

authRoute.get("/login", async (req, res) => {
  const body = req.body;
  const password = body.password;

  if (!body.username && !body.email) {
    throw new ErrorHandler(
      401,
      "Please provide either a username or an email."
    );
  }

  let key, value;

  if (body.username) {
    key = "username";
    value = body.username;
  } else {
    key = "email";
    value = body.email;
  }

  const user = await getUserByKey(key, value);

  const isValid = await comparePassword(password, user.password);
  if (isValid) {
    const userObj = omit(user, "password");
    const token = jwt.sign(
      { data: { userId: user.id } },
      config.get("credentials.token_secret"),
      {
        expiresIn: "60s",
      }
    );
    const refreshToken = jwt.sign(
      { data: { userId: user.id } },
      config.get("credentials.refresh_secret"),
      {
        expiresIn: "1h",
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    return res.status(200).send({
      ...userObj,
      token,
    });
  } else {
    throw new ErrorHandler(403, "Invalid password");
  }
});

authRoute.get("/refresh-token", async (req, res) => {
  // reading refrsh token from the cookies, if its available then
  // we'll verify the rToken and again regenerate both token and refeshToken again and
  // set the refresh token again in the cookie and send the new token back.
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ErrorHandler(401, "Refresh token missing");
  }
  try {
    const userId = jwt.verify(
      refreshToken,
      config.get("credentials.refresh_secret")
    );

    const newToken = jwt.sign(
      { data: userId },
      config.get("credentials.token_secret"),
      {
        expiresIn: "60s",
      }
    );
    const newRefreshToken = jwt.sign(
      { data: userId },
      config.get("credentials.token_secret")
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });
    res.status(200).send({
      token: newToken,
    });
  } catch (error) {
    throw new ErrorHandler(500, "Something went wrong");
  }
});

module.exports = {
  authRoute,
};


const joi = require("joi");
const bcrypt = require("bcrypt");

const validateUser = function (userObj) {
  const schema = joi.object({
    name: joi.string().min(5).required(),
    email: joi.string().min(10).required().email(),
    password: joi.string().min(6).required(),
    username: joi.string().min(6).required(),
  });

  return schema.validate(userObj)
};

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    return Promise.reject("Something went wrong");
  }
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  validateUser,
  hashPassword,
  comparePassword,
};

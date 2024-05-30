const Joi = require("joi");

const validateComment = (obj) => {
  const schema = Joi.object({
    text: Joi.string(),
  });
  return schema.validate(obj);
};
module.exports = {
  validateComment,
};

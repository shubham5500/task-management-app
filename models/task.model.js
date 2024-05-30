const Joi = require("joi");

const validateTask = (task) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    status: Joi.string().valid("pending", "completed", "in_progess").required(),
    priority: Joi.string().valid("low", "medium", "high").required(),
    createdBy: Joi.number().required(),
    assignedTo: Joi.number().required(),
    position: Joi.number(),
    listId: Joi.number().required(),
    fileUrl: Joi.string(),
  });

  return schema.validate(task);
};

const validateTaskFile = (obj) => {
  const schema = Joi.object({
    fileUrl: Joi.string().required(),
    uploadedBy: Joi.number().required(),
  });

  return schema.validate(obj);
};

module.exports = {
  validateTask,
  validateTaskFile,
};

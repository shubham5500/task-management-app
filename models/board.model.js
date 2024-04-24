const Joi = require('joi');

const validateBoard = (list) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
    })

    return schema.validate(list);
}

module.exports = {
    validateBoard
}
const Joi = require('joi');

const validateList = (list) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        boardId: Joi.required(),
    })

    return schema.validate(list);
}

module.exports = {
    validateList
}
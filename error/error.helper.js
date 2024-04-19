const { logger } = require("../helper/logger.helper");

class ErrorHandler extends Error {
  constructor(statusCode, message, stack) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    }
  }
}

const handlerError = (err, req, res, next) => {
  console.log(err.message);
  const { message, statusCode } = err;
  logger.error(err);
  res.status(statusCode || 500).json({
    status: "error",
    message: statusCode === 500 ? "something went wrong" : message,
  });
  next();
};

module.exports = {
    ErrorHandler,
    handlerError
}

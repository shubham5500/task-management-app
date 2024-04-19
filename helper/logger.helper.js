const winston = require('winston');
const path = require('path')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({level: 'error', filename: path.resolve('error/helper.log')}),
    ]
})

module.exports = {
    logger
}
const winston = require('winston');
const expressWinston = require('express-winston');

// O cabeçalho authorization carrega o JWT; ele não deve ser gravado nos logs.
const headerBlacklist = ['authorization', 'cookie'];

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
  headerBlacklist,
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
  headerBlacklist,
});

module.exports = { requestLogger, errorLogger };

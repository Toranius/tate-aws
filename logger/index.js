'use strict';

const winston = require('winston');

const logger = new winston.Logger({
  level: process.env.LOG_LEVEL,
  transports: [
    new winston.transports.Console(),
  ]
});

logger.debug = msg => logger.log('debug', msg);

module.exports = logger;
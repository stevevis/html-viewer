'use strict';

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
      timestamp: true,
      colorize: true,
      prettyPrint: true,
      handleExceptions: true
    })
  ]
});

module.exports = logger;

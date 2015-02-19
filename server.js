'use strict';

// Dependencies
var koa = require('koa');
var views = require('koa-views');
var koaStatic = require('koa-static');
var errorHandler = require('koa-error');
var requestLogger = require('koa-logger');
var responseTime = require('koa-response-time');

// Local dependencies
var logger = require('./config/logger');
var routes = require('./config/routes');

// Initialize the server
var app = module.exports = koa();
var port = process.env.PORT || 3000;

// Setup development middleware
if (app.env === 'development') {
  app.use(requestLogger());
}

// Setup middleware
app.use(responseTime());
app.use(errorHandler());
app.use(views('views'));
app.use(koaStatic(__dirname + '/public/'));

// Initialize the router
routes(app);

// Start the server if this script wasn't required by another script e.g. a function test script
if (!module.parent) {
  app.listen(port);
  logger.info('Server started, listening on port: ' + port);
}
logger.info('Environment: ' + app.env);

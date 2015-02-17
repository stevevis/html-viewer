'use strict';

// Dependencies
var koa = require('koa');
var views = require('koa-views');
var logger = require('koa-logger');
var koaStatic = require('koa-static');
var errorHandler = require('koa-error');
var responseTime = require('koa-response-time');

// Local dependencies
var routes = require('./routes');

// Initialize the server
var app = module.exports = koa();
var port = process.env.PORT || 3000;

// Setup development middleware
if (app.env === 'development') {
  app.use(logger());
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
  console.log('Server started, listening on port: ' + port);
}
console.log('Environment: ' + app.env);

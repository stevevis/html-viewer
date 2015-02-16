'use strict';

// Dependencies
var fs = require('fs');
var koa = require('koa');
var logger = require("koa-logger");
var koaStatic = require("koa-static");
var nunjucks = require("koajs-nunjucks");
var errorHandler = require("koa-error");
var responseTime = require("koa-response-time");

// Local dependencies
var routes = require('./routes')

// Initialize the server
var app = koa();
var port = process.env.PORT || 3000;

// Setup development middleware
if (app.env === "development") {
  app.use(logger());
}

// Setup middleware
app.use(responseTime());
app.use(errorHandler());
app.use(nunjucks('views'));
app.use(koaStatic(__dirname + '/public/'));

// Initialize the router
routes(app);

// Start the server
app.listen(port);

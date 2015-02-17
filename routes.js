'use strict';

var router = require('koa-router');
var IndexController = require('./controllers/IndexController.js');
var SummaryController = require('./controllers/SummaryController.js');

module.exports = function(app) {
  app.use(router(app));
  app.get('/', IndexController.get);
  app.get('/summary', SummaryController.get);
};

const debug = require('debug')('app:core');
const Controller = require('egg').Controller;

const extendApplication = require('./lib/extend/application');
const extendController = require('./lib/extend/controller');
const extendValidator = require('./lib/extend/validator');

module.exports = app => {
  app.beforeStart(async () => {
    debug('app start');
  });

  extendApplication(app);
  extendController(Controller);
  extendValidator(app.validator);
}

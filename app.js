const debug = require('debug')('app:core');
const Controller = require('egg').Controller;

const extendController = require('./lib/extend/controller');
const extendValidator = require('./lib/extend/validator');

module.exports = app => {
  app.beforeStart(async () => {
    debug('app start');
  });

  extendController(Controller);
  extendValidator(app.validator);
}

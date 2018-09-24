'use strict';
const debug = require('debug')('app:controller:ab');
const Controller = require('egg').Controller;

class AbController extends Controller {
  async index() {
    debug('candy %o', this.ctx.request.candy);
    this.ctx.body = { success: true, body: 'lalala' };
  }
}

module.exports = AbController;


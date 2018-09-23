'use strict';

const Controller = require('egg').Controller;

class AbController extends Controller {
  async index() {
    // console.log('this', this);
    this.ctx.body = 'hi, ab';
  }
}

module.exports = AbController;


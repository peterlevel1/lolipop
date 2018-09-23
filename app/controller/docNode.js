const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:docNode');
const { table } = require('../lib/controller/docNode');

class DocNodeController extends Controller {
  async create() {
    const body = this.ctx.request.body;

    const data = await this.service.common.create(table, body);

    this.ctx.body = { success: true, data };
  }

  async index() {
    const { query } = this.ctx;

    const data = await this.service.common.find(table, query);

    this.ctx.body = { success: true, data };
  }

  async show() {
    const { params } = this.ctx;

    const data = await this.service.common.findOne(table, { id: params.id });

    this.ctx.body = { success: true, data };
  }
}

module.exports = DocNodeController;

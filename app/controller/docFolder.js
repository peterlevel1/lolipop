const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:docFolder');
const { table } = require('../lib/controller/docFolder');

class DocFolderController extends Controller {
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

module.exports = DocFolderController;

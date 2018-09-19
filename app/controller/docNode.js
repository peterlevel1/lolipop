const Controller = require('egg').Controller;
const debug = require('debug')('controller:docNode');
const { table } = require('../../config/controller/docNode');

class DocNodeController extends Controller {
  async show() {
    const { params } = this.ctx;

    const data = await this.service.common.findOne(table, { id: params.id });

    this.ctx.body = { success: true, data };
  }

  async showChildren() {
    const { params } = this.ctx;

    const data = await this.service.common.find(table, { parentId: params.id });

    this.ctx.body = { success: true, data };
  }
}

module.exports = DocNodeController;

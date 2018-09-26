const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:project');
const { table } = require('../lib/controller/project');

class ProjectController extends Controller {
  async create() {
    const body = this.ctx.request.body;

    const data = await this.service.common.create(table, body);

    this.ctx.body = { success: true, data };
  }

  async index() {
    const data = await this.service.common.find(table, {
      uid: this.ctx.session.user.id,
      status: 1
    });

    this.ctx.body = { success: true, data };
  }

  async show() {
    const data = await this.service.common.findOne(table, {
      id: this.ctx.params.id,
      status: 1
    });

    this.ctx.body = { success: true, data };
  }

  async update() {
    const id = this.ctx.params.id;
    const body = this.ctx.request.body;

    const data = await this.service.common.update(table, {
      id,
      ...body,
    });

    this.ctx.body = { success: true };
  }

  async destroy() {
    const id = this.ctx.params.id;

    await this.service.common.update(table, { id, status: 0 });

    this.ctx.body = { success: true };
  }
};

module.exports = ProjectController;

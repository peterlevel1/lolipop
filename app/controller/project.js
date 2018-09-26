const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:project');
const { table } = require('../lib/controller/project');

class ProjectController extends Controller {
  async index() {
    const data = await this.service.common.find(table, { uid: this.ctx.session.user.id });

    this.ctx.body = {
      success: true,
      data: (data || []).map(item => {
        const { id, name, desc, updatedAt, createdAt } = item;
        return { id, name, desc, updatedAt, createdAt };
      })
    };
  }

  async show() {
    const data = await this.service.common.findOne(table, { id: this.ctx.params.id });

    this.ctx.body = { success: true, data };
  }

  async update() {
    const { params, request } = this.ctx;

    await this.service.project.update({
      id: params.id,
      ...request.body
    });

    this.ctx.body = { success: true };
  }
};

module.exports = ProjectController;

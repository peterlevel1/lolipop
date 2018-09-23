const Service = require('egg').Service;
const debug = require('debug')('app:service:common');

class CommonService extends Service {
  async create(table, condition) {
    return await this.app.mysql.insert(table, condition);
  }

  async findOne(table, condition) {
    return await this.app.mysql.get(table, condition);
  }

  async find(table, where) {
    return await this.app.mysql.select(table, { where });
  }

  async update(table, condition) {
    return await this.app.mysql.update(table, condition);
  }

  async del(table, condition) {
    return await this.app.mysql.delete(table, condition);
  }
}

module.exports = CommonService;

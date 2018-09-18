const Service = require('egg').Service;

class CommonService extends Service {
  async create(table, condition) {
    return await this.app.mysql.insert(table, condition);
  }

  async findOne(table, condition) {
    return await this.app.mysql.get(table, condition);
  }

  async find(table, condition) {
    return await this.app.mysql.select(table, condition);
  }

  async update(table, condition) {
    return await this.app.mysql.update(table, condition);
  }

  async del(table, condition) {
    return await this.app.mysql.delete(table, condition);
  }
}

module.exports = CommonService;

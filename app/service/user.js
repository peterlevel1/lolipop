const Service = require('egg').Service;
const debug = require('debug')('app:service:user');
const { table } = require('../lib/controller/user');
const { DAY } = require('../lib/constants');

class UserService extends Service {
  addUserSession(user, rememberme) {
    const session = this.ctx.session;

    // TODO: 设置 maxAge, session的_expire会被自动设置
    session.maxAge = rememberme ? 7 * DAY : DAY;
    session.user = user;
  }

  delUserSession() {
    const session = this.ctx.session;

    // TODO: 一旦设置为-1，就什么东西都存不住了
    session.maxAge = -1;
    session.user = null;
  }

  async findUserInSession(username) {
    const sessionTable = this.app.config.sessionMysql.table;
    const sql = `SELECT * from ${sessionTable} WHERE data like '%"username":"${username}"%'`;

    const results = await this.app.mysql.query(sql);

    if (results && results[0] && results[0].data) {
      return JSON.parse(results[0].data);
    }

    return null;
  }

  async delUserInSession(username) {
    const sessionTable = this.app.config.sessionMysql.table;
    const sql = `DELETE from ${sessionTable} WHERE data like '%"username":"${username}"%'`;

    await this.app.mysql.query(sql);
  }
}

module.exports = UserService;

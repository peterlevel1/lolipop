const assert = require('assert');
const MysqlSessionStore = require('./lib/MysqlSessionStore');

module.exports = app => {
  const name = app.config.sessionMysql.name;
  const mysql = name ? app.mysql.get(name) : app.mysql;
  assert(mysql, `mysql instance [${name || ''}] not exists`);

  const table = app.config.sessionMysql.table;
  assert(table, `table: ${name}, should not be undefined`);

  app.sessionStore = new MysqlSessionStore({ ...app.config.sessionMysql, mysql });
};

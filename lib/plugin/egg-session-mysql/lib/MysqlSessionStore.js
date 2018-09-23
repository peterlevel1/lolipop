const debug = require('debug')('app:plugin:MysqlSessionStore');
const FORTY_FIVE_MINUTES = 45 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

function getExpiresOn(session, ttl) {
  let expiresOn = null;
  ttl = ttl || FORTY_FIVE_MINUTES

  if (session && session.cookie && session.cookie.expires) {
    if (session.cookie.expires instanceof Date) {
      expiresOn = session.cookie.expires
    } else {
      expiresOn = new Date(session.cookie.expires)
    }
  } else {
    let now = new Date();
    expiresOn = new Date(now.getTime() + ttl);
  }
  return expiresOn
}

function replaceTable(str, table) {
  return str.replace('{{table}}', table);
}

function logger(data) {
  console.info(`path:${__filename}:\n`, data);
}

class MysqlSessionStore {
  constructor(options) {
    // init mysql and sql strings
    this.mysql = options.mysql;
    this.setSql(options);

    // create table
    this.mysql.query(this.sql.createTable);

    // set timer
    this.timer = setInterval(this.cleanup.bind(this), options.cleanInterval || FIFTEEN_MINUTES);
  }

  setSql(options) {
    this.sql = {
      createTable: replaceTable(
        'CREATE TABLE IF NOT EXISTS `{{table}}` (`id` VARCHAR(255) NOT NULL, `expires` BIGINT NULL, `data` TEXT NULL, PRIMARY KEY (`id`), KEY `_mysql_session_store__expires` (`expires`));',
        options.table
      ),
      add: replaceTable(
        'INSERT INTO {{table}}(id, expires, data) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE expires = ?, data = ?',
        options.table
      ),
      findOne: replaceTable(
        'SELECT * FROM `{{table}}` WHERE id = ? AND expires > ?',
        options.table
      ),
      del: replaceTable(
        'DELETE FROM `{{table}}` WHERE id = ?',
        options.table
      ),
      cleanup: replaceTable(
        'DELETE FROM `{{table}}` WHERE expires < ?',
        options.table
      )
    };
  }

  async cleanup() {
    await this.mysql.query(this.sql.cleanup, [ Date.now() ]);
  }

  async get(sid) {
    let results = await this.mysql.query(this.sql.findOne, [sid, Date.now()]);
    let session = null;
    if (results && results[0] && results[0].data) {
      session = JSON.parse(results[0].data);
    }
    return session;
  }

  async set(sid, session, ttl) {
    let expires = getExpiresOn(session, ttl).valueOf()
    let data = JSON.stringify(session);
    let results = this.mysql.query(this.sql.add, [sid, expires, data, expires, data]);
    await results.then(res => {})
      .catch(err => {
        logger(err);
      });
    return results
  }

  async destroy(sid) {
    await this.query(this.query.del, [sid]);
  }
}

module.exports = MysqlSessionStore;

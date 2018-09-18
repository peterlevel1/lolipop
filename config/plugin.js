'use strict';

const path = require('path');

// had enabled by egg
// exports.static = true;

exports.sessionMysql = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-session-mysql')
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql'
};

exports.validate = {
  enable: true,
  package: 'egg-validate'
};

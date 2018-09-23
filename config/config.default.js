'use strict';

const setDefaultConfig = require('./_config.default');

module.exports = appInfo => {
  const config = exports = {};

  setDefaultConfig(appInfo, config);

  return config;
};

/*
module.exports = appInfo => {
  const config = exports = {};

  return config;
};
*/
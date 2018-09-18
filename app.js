const debug = require('debug');
const configDebug = require('./config/debug');

debug.enable(configDebug);

module.exports = app => {
  const appDebug = debug('app');

  // used for view render work
  const isProd = app.config.env === 'prod';
  app.locals = {
    isProd,
    feHost: isProd ? '' : 'http://localhost:3003',
  };

  // appDebug('app.config %o', app.config);
  app.beforeStart(async () => {
    appDebug('app start');
  });

  // validate the parameters
  const Parameter = app.validator.constructor;

  app.validator.addRule('@int', function (rule, value) {
    return Parameter.TYPE_MAP.int.call(this, rule, value - 0);
  });
}

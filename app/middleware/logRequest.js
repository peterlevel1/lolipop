const debug = require('debug')('app:middleware:logRequest');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    debug('%s %s', ctx.request.method, ctx.request.url);

    await next();
  };
};

const debug = require('debug')('app:middleware:allowedMethods');

module.exports = (options) => {
  return async function(ctx, next) {
    if (!options.methods.includes(ctx.method)) {
      // method not allowed
      ctx.status = 405;
      ctx.set('Allow', options.methods.join(', '));
      return;
    }

    await next();
  };
};

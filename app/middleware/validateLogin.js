const debug = require('debug')('middleware:validateLogin');

module.exports = (options = {}) => {
  const required = options.required.map(url => {
    return new RegExp(`^${url}`);
  });

  return async function validateLogin(ctx, next) {
    // TODO: 对来源验证
    const url = ctx.req.url;
    // console.log('url', url);

    if (ctx.session.uid) {
      await next();
      return;
    }

    if (options.whilelist.includes(url)) {
      await next();
      return;
    }

    const needsLogin = required.some(reg => reg.test(url));
    if (needsLogin && !ctx.session.uid) {
      ctx.body = {
        success: false,
        redirectUrl: `${options.target}?redirectUrl=${encodeURIComponent(ctx.request.href)}`,
        message: '您还尚未登录'
      };
      // ctx.redirect();
      return;
    }

    await next();
  };
};

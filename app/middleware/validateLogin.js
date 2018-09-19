const debug = require('debug')('middleware:validateLogin');

module.exports = (options = {}) => {
  const required = options.required.map(url => {
    return new RegExp(`^${url}`);
  });

  function needsLogin(url) {
    return required.some(reg => reg.test(url));
  }

  return async function validateLogin(ctx, next) {
    // TODO: 对来源验证
    const url = ctx.req.url;

    if (ctx.session.uid || options.whilelist.includes(url)) {
      await next();
      return;
    }

    if (needsLogin(url) && !ctx.session.uid) {
      ctx.body = {
        success: false,
        needsLogin: true,
        // TODO: 公用的登陆路径
        // redirectUrl: `${options.target}?redirectUrl=${encodeURIComponent(ctx.request.href)}`,
        message: '您还尚未登录'
      };
      return;
    }

    await next();
  };
};

const debug = require('debug')('app:middleware:validateLogin');
const { getClientSource } = require('../lib/utils');

module.exports = (options = {}) => {
  const requiredArr = options.urls.map(url => {
    return new RegExp(`^${url}`);
  });

  function needsLogin(url) {
    return requiredArr.some(reg => reg.test(url));
  }

  return async function validateLogin(ctx, next) {
    const user = ctx.session.user;

    if (user) {
      // hacker may take advantage of the user cookie
      if (getClientSource(ctx) !== user.lastLoginInfo) {
        ctx.body = { success: false, needsLogin: true, message: '重新登录' };
        return;
      }

      await next();
      return;
    }

    const url = ctx.request.url;

    if (options.whilelist.includes(url) || !needsLogin(url)) {
      await next();
      return;
    }

    ctx.body = { success: false, needsLogin: true, message: '尚未登录' };
  };
};

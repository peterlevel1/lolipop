const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:user');
const { rules, table, encryptPassword } = require('../lib/controller/user');
const { getClientSource } = require('../lib/utils');

exports.create = async function(ctx) {
  const body = ctx.request.body;

  // 1. compare captcha
  const captchaClient = body.captcha.toLowerCase();
  const captchaServer = ctx.session.captcha.toLowerCase();
  if (captchaClient !== captchaServer) {
    ctx.body = { success: false, message: 'captcha is wrong' };
    return;
  }

  // 2. encrypt password
  body.password = encryptPassword(body.password);

  await ctx.service.user.create(body);

  // TODO: handle body.rememberme
  ctx.body = { success: true, message: '创建用户成功' };
}

exports.login = async function(ctx) {
  // 1. test whether the user has been logined or not
  if (ctx.session.user) {
    ctx.body = { success: false, message: '先退出，再登陆' };
    return;
  }

  const { lolly, service } = ctx;

  // 2. compare captcha

  // 3. find the user
  let user = await service.common.findOne(table, { username: lolly.username });
  if (!user) {
    ctx.body = { success: false, message: 'no user' };
    return;
  }

  // 4. compare password
  const passwordEncrypted = encryptPassword(lolly.password);
  if (passwordEncrypted !== user.password) {
    ctx.body = { success: false, message: 'password is wrong' };
    return;
  }

  // 5. ensure the current user is the only user
  const prevSessionStoreUser = await service.user.findUserInSession(user.username);
  if (prevSessionStoreUser) {
    await service.user.delUserInSession(user.username);
  }

  // 6. handle user lastLoginInfo
  const loginInfo = getClientSource(ctx);
  if (!user.lastLoginInfo || user.lastLoginInfo !== loginInfo) {
    await service.common.update(table, { id: user.id, lastLoginInfo: loginInfo });

    user = await service.common.findOne(table, { username: lolly.username });
  }

  // 7. set user data on the session
  service.user.addUserSession(user, lolly.rememberme);

  // ctx.body = { success: true, data: { csrfToken: ctx.csrf }, message: '登录成功' };
  ctx.body = { success: true, message: '登录成功' };
}

exports.info = async function(ctx) {
  const user = ctx.session.user;

  ctx.body = {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      intro: user.intro,
      avatar: user.avatar
    }
  };
}

exports.logout = async function(ctx) {
  ctx.service.user.delUserSession();

  ctx.body = { success: true, message: '登出成功' };
}

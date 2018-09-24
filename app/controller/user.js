const Controller = require('egg').Controller;
const debug = require('debug')('app:controller:user');
const { rules, table, encryptPassword } = require('../lib/controller/user');
const { getClientSource } = require('../lib/utils');

class UserController extends Controller {
  // user register
  async create() {
    const ctx = this.ctx;
    const body = ctx.request.body;

    ctx.validate(rules.create, body);

    // 1. compare captcha
    const captchaClient = body.captcha.toLowerCase();
    const captchaServer = this.session.captcha.toLowerCase();
    if (captchaClient !== captchaServer) {
      ctx.body = { success: false, message: 'captcha is wrong' };
      return;
    }

    // 2. compare password
    if (body.password !== body.password2) {
      ctx.body = { success: false, message: 'the 2 passwords are not equal' };
      return;
    }

    // 3. encrypt password
    body.password = encryptPassword(body.password);

    await this.service.user.create(body);

    // TODO: handle body.rememberme
    ctx.status = 201;
  }

  // TODO: 暂时不检查 captcha
  async login() {
    const ctx = this.ctx;
    const { request, service, session } = ctx;
    const body = request.body;

    // 1. test whether the user has been logined or not
    if (session.user) {
      ctx.body = { success: false, message: '先退出，再登陆' };
      return;
    }

    // 2. compare captcha

    // 3. find the user
    let user = await service.common.findOne(table, { username: body.username });
    if (!user) {
      ctx.body = { success: false, message: 'no user' };
      return;
    }

    // 4. compare password
    const passwordEncrypted = encryptPassword(body.password);
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

      user = await service.common.findOne(table, { username: body.username });
    }

    debug('user controller, csrf: before rotate %s', this.ctx.csrf);
    // 7. set user data on the session
    service.user.addUserSession(user, body.rememberme);

    ctx.body = { success: true, data: { csrfToken: ctx.csrf }, message: '登录成功' };
  }

  /**
   * 用户自动获取数据库的信息
   */
  async info() {
    debug('user info');
    const user = this.ctx.session.user;
    debug('candy %o', this.ctx.request.candy);

    this.ctx.body = {
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

  async logout() {
    this.service.user.delUserSession();

    this.ctx.body = { success: true, message: '登出成功' };
  }
}

module.exports = UserController;

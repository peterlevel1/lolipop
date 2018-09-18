const Controller = require('egg').Controller;
const debug = require('debug')('controller:user');
const { rules, table, PASSWORD_LENGTH, DAY } = require('../../config/controller/user');

class UserController extends Controller {
  // user register
  async create() {
    if (!this.session) {
      this.ctx.body = { success: false, message: 'where are you ?' };
      return;
    }

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
    body.password = util.encryptPassword(body.password);

    await this.service.user.create(body);

    // TODO: handle body.rememberme
    ctx.status = 201;
  }

  addUserSession(user, rememberme) {
    this.ctx.session.uid = user.id;
    this.ctx.session.isLogin = true;

    // TODO: 设置 maxAge, session的_expire会被自动设置
    if (this.ctx.request.body.rememberme) {
      this.ctx.session.maxAge = 7 * DAY;
    } else {
      this.ctx.session.maxAge = DAY;
    }
  }

  delUserSession() {
    this.ctx.session.uid = null;
    this.ctx.session.isLogin = false;
    // TODO: 一旦设置为-1，就什么东西都存不住了
    // this.ctx.session.maxAge = -1;
  }

  // TODO: 暂时不检查 captcha
  async login() {
    const body = this.ctx.request.body;

    // 1. validate body
    this.ctx.validate(rules.login, body);

    // 2. compare captcha

    // 3. find the user
    const user = await this.service.common.find(table, { username: body.username });
    if (!user) {
      this.ctx.body = { success: false, message: 'no user' };
      return;
    }

    // 4. compare password
    const passwordEncrypted = utils.encrypt(body.password, PASSWORD_LENGTH);
    if (passwordEncrypted !== user.password) {
      this.ctx.body = { success: false, message: 'password is wrong' };
      return;
    }

    // 5. set user data on the session
    this.addUserSession(user, body.rememberme);

    const redirectUrl = this.ctx.request.query.redirectUrl;
    if (redirectUrl) {
      this.ctx.redirect(decodeURIComponent(redirectUrl));
      return;
    }

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

  async info(next) {
    const user = await this.service.common.find(table, {
      id: this.ctx.session.uid
    });

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
    this.delUserSession();

    this.ctx.body = { success: true };
  }
}

module.exports = UserController;

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.resources('user', '/api/user', app.controller.user);
  router.resources('user', '/api/project', app.controller.project);

  router.get('/', controller.home.index);

  router.get('/res/u/info', 'user.info');
  router.post('/res/login', 'user.login');
  router.get('/res/logout', 'user.logout');
};

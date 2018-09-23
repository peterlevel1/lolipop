'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', 'home.index');
  router.get('/a/b', 'a.b.index');

  // login/logout logic
  router.get('/res/user/info', 'user.info');
  router.post('/res/user/login', 'user.login');
  router.get('/res/user/logout', 'user.logout');

  // api
  router.resources('/api/user', 'user');
  router.resources('/api/project', 'project');
  router.resources('/api/docFolder', 'docFolder');
  router.resources('/api/docNode', 'docNode');
};

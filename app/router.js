'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.resources('user', '/api/user', app.controller.user);
  router.resources('project', '/api/project', app.controller.project);
  router.resources('docNode', '/api/docNode', app.controller.project);

  router.get('/api/docNode/:id/children', 'docNode.showChildren');

  router.get('/', controller.home.index);

  router.get('/res/u/info', 'user.info');
  router.post('/res/u/login', 'user.login');
  router.get('/res/u/logout', 'user.logout');
};

'use strict';
const debug = require('debug')('app:router');
const { ACTION_PREFIX, API_PREFIX } = require('./lib/constants');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', 'home.index');
  router.get('/a/b', 'a.b.index');

  router.all('/*', async (ctx, next) => {
    debug('all _matchedRoute /* :', ctx._matchedRoute);
    debug('all _matchedRouteName /* :', ctx._matchedRouteName);
    await next();
  });

  // login/logout logic
  router.get(`/${ACTION_PREFIX}/user/info`, 'user.info');
  router.post(`/${ACTION_PREFIX}/user/login`, 'user.login');
  router.get(`/${ACTION_PREFIX}/user/logout`, 'user.logout');

  // api
  router.resources(`/${API_PREFIX}/user`, 'user');
  router.resources(`/${API_PREFIX}/project`, 'project');
  router.resources(`/${API_PREFIX}/docFolder`, 'docFolder');
  router.resources(`/${API_PREFIX}/docNode`, 'docNode');
};

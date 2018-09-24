const debug = require('debug')('app:extend:request');
const { ACTION_PREFIX, API_PREFIX } = require('../lib/constants');

module.exports = {
  get candy() {
    if (!this.ctx._matchedRoute) {
      return null;
    }

    const str = this.ctx._matchedRoute.replace(/^\//, '');
    const arr = str.split('/');
    const prefix = arr.shift();

    if (![ API_PREFIX, ACTION_PREFIX ].includes(prefix)) {
      return null;
    }

    let store = this.app.controllerStore,
      i = 0,
      ii = arr.length,
      lastIndex = ii - 1,
      key;

    for (i = 0, ii; i < ii; i++) {
      key = arr[i];

      if (!store[key] || typeof store[key] !== 'object') {
        // TODO: throw new Error('no store for controller');
        store = null;
        break;
      }

      store = store[key];
      if (store.__file) {
        break;
      }
    }

    if (!store) {
      return null;
    }

    let action;

    if (API_PREFIX === prefix) {
      switch (this.method) {
        case 'GET':
          action = i === lastIndex ? 'index' : 'show';
        break;
        case 'POST':
          action = 'create';
        break;
        case 'PUT':
          action = 'update';
        break;
        case 'DELETE':
          action = 'destroy';
        break;
      }
    }

    if (ACTION_PREFIX === prefix) {
      // TODO: i !== lastIndex
      action = arr[lastIndex];
    }

    return {
      store,
      controller: key,
      action,
    };
  }
};

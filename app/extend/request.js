const debug = require('debug')('app:extend:request');
const { ACTION_PREFIX, API_PREFIX } = require('../lib/constants');

const LOLLY = Symbol('Request#lolly');
const CANDY = Symbol('Request#candy');

module.exports = {

  get lolly() {
    if (this[LOLLY] !== undefined) {
      return this[LOLLY];
    }

    const candy = this.candy;

    if (!candy || !candy.store.rules) {
      this[LOLLY] = null;
      return;
    }

    const rule = candy.store.rules[candy.action];
    if (!rule) {
      this[LOLLY] = null;
      return;
    }

    const body = this.method === 'GET' ? this.query : this.body;
    const data = Object.keys(rule).reduce((memo, key) => {
      if (body[key] !== undefined) {
        memo[key] = body[key];
      }
      return memo;
    }, {});

    this.ctx.validate(rule, data);

    this[LOLLY] = Object.keys(data).length > 0 ? data : null;

    return this[LOLLY];
  },

  get candy() {
    if (this[CANDY] !== undefined) {
      return this[CANDY];
    }

    if (!this.ctx._matchedRoute) {
      this[CANDY] = null;
      return;
    }

    const str = this.ctx._matchedRoute.replace(/^\//, '');
    const arr = str.split('/');
    const prefix = arr.shift();

    if (![ API_PREFIX, ACTION_PREFIX ].includes(prefix)) {
      this[CANDY] = null;
      return;
    }

    let store = this.app.controllerStore,
      i = 0,
      ii = arr.length,
      lastIndex = ii - 1,
      key;

    for (i = 0, ii; i < ii; i++) {
      key = arr[i];

      if (!store[key] || typeof store[key] !== 'object') {
        store = null;
        break;
      }

      store = store[key];
      if (store.__file) {
        break;
      }
    }

    if (!store) {
      this[CANDY] = null;
      return;
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

    this[CANDY] = {
      store,
      controller: arr.slice(0, i + 1).join('.'),
      action,
    };

    return this[CANDY];
  }
};

const debug = require('debug')('app:extend:context');

module.exports = {
  get lolly() {
    return this.request.lolly;
  },

  get candy() {
    return this.request.candy;
  }
};

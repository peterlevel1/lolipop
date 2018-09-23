const debug = require('debug')('app:@lib:extend:controller');

const ASYNC_FUNCTION_NAME = 'AsyncFunction';

module.exports = function extendController(Controller) {
  debug('extend controller %s', Controller.name);

  Controller._getActions = function _getActions() {
    const proto = this.prototype;
    const actions = Object.getOwnPropertyNames(proto);

    let action, length;
    while (length-- > 0) {
      action = actions[length];

      if (
        typeof proto[action] !== 'function' ||
        proto[action].constructor.name !== ASYNC_FUNCTION_NAME
      ) {
        actions.splice(length, 1);
      }
    }

    return actions;
  };
}

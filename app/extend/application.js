const path = require('path');
const dirLoader = require('../../lib/dir-loader');
const CONTROLLER_STORE = Symbol('Application#controllerStore');

module.exports = {
  get controllerStore() {
    if (!this[CONTROLLER_STORE]) {
      const dir = path.join(this.baseDir, 'app/lib/controller');
      this[CONTROLLER_STORE] = dirLoader(dir);
    }

    return this[CONTROLLER_STORE];
  }
}

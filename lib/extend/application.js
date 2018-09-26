const path = require('path');
const dirLoader = require('../dir-loader');

module.exports = (app) => {
  const dir = path.join(app.baseDir, 'app/lib/controller');

  app.controllerStore = dirLoader(dir);
}

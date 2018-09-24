const fs = require('fs');
const path = require('path');
const assert = require('assert');

const EXT_JS = '.js';

module.exports = function dirLoader(dir, cb, obj = Object.create(null)) {
  assert.ok(path.isAbsolute(dir), `dir: ${dir}, not a absolute path`);

  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    let key;

    if (stats.isDirectory()) {
      key = path.basename(file);
      obj[key] = dirLoader(filePath, cb);
      // obj[key].__dir = true;
      // if (cb) cb(obj[key]);
      return;
    }

    const ext = path.extname(file);
    assert.ok(ext === EXT_JS, `ext: ${ext}, is not: ${EXT_JS}`);

    key = path.basename(file, ext);
    obj[key] = require(filePath);
    obj[key].__file = true;
    if (cb) cb(obj[key]);
  });

  return obj;
}

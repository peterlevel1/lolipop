const fs = require('fs');
const path = require('path');
const assert = require('assert');

const EXT_JS = '.js';

module.exports = function dirLoader(dir, obj = {}) {
  assert.ok(path.isAbsolute(dir), `dir: ${dir}, not a absolute path`);

  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    let key;

    if (stats.isDirectory()) {
      key = path.basename(file);
      obj[key] = loadDir(filePath);

      return;
    }

    const ext = path.extname(file);
    assert.ok(ext === EXT_JS, `ext: ${ext}, is not: ${EXT_JS}`);

    key = path.basename(file, ext);
    obj[key] = require(filePath);
  });

  return obj;
}

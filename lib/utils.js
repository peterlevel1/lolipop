const crypto = require('crypto');

exports.encrypt = function(text, n) {
  const ret = crypto.createHash('md5').update(text, 'utf8').digest('hex');
  return !n ? ret : ret.slice(0, n);
}

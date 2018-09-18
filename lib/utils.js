const crypto = require('crypto');

export function encrypt(text, n) {
  const ret = crypto.createHash('md5').update(text, 'utf8').digest('hex');
  return !n ? ret : ret.slice(0, n);
}

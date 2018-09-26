const crypto = require('crypto');

const SEPARATOR = '###';

exports.encrypt = function encrypt(text, n) {
  const ret = crypto.createHash('md5').update(text, 'utf8').digest('hex');
  return !n ? ret : ret.slice(0, n);
}

exports.getClientSource = function getClientSource(ctx) {
  const ip = ctx.ip;
  const userAgent = ctx.get('User-Agent');

  return `${ip}${SEPARATOR}${userAgent}`;
}

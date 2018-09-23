const debug = require('debug')('app:@lib:extend:validator');

module.exports = function extendsValidator(validator) {
  debug('extends validator');

  const TYPE_MAP = validator.constructor.TYPE_MAP;

  validator.addRule('@int', function (rule, value) {
    return TYPE_MAP.int.call(this, rule, parseInt(value));
  });

  validator.addRule('@number', function (rule, value) {
    return TYPE_MAP.number.call(this, rule, +value);
  });

  validator.addRule('@bool', function (rule, value) {
    return TYPE_MAP.bool.call(this, rule, !!value);
  });
}

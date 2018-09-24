const { encrypt } = require('../utils');

exports.table = 'lolipop_user';

exports.rules = {
  login: {
    username: {
      type: 'email',
      required: true
    },
    password: {
      type: 'password',
      required: true,
      min: 6,
      max: 20
    },
  },

  create: {
    username: {
      type: 'email',
      required: true,
      max: 20
    },
    nickname: {
      type: 'string',
      required: true,
      max: 20
    },
    captcha: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
      min: 6,
      max: 20
    },
    password2: {
      type: 'string',
      compare: 'password',
    }
  }
};

const PASSWORD_LENGTH = 20;

exports.encryptPassword = function(password) {
  return encrypt(password, PASSWORD_LENGTH);
}
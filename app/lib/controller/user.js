const { encrypt } = require('../utils');

const PASSWORD_LENGTH = 20;

exports.table = 'lolipop_user';

exports.validate = function() {

}

exports.rules = {
  login: {
    username: {
      type: 'email',
      required: true
    },
    password: {
      type: 'password',
      required: true
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

exports.encryptPassword = function(password) {
  return encrypt(password, PASSWORD_LENGTH);
}
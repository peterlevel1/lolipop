module.exports = (appInfo, config) => {
  const ret = {
    keys: 'love internet, search anything, so, what do u say ? haha',

    middleware: ['logRequest', 'validateLogin', 'errorHandler'],

    validateLogin: {
      // target: 'http://localhost:3003/login',

      urls: [
        '/res/u/info',
        '/res/u/logout',
        '/api',
      ],

      whilelist: []
    },

    security: {
      csrf: {
        useSession: true,
        sessionName: 'csrfToken',
        ignore: (ctx) => {
          const { method, url } = ctx.request;

          return `${method} ${url}` === 'POST /res/u/login';
        }
      }
    },

    session: {
      key: 'lolipop_session',
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      encrypt: true,
      renew: false,
    },

    mysql: {
      client: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'test',
        // 日期写成字符串
        dateStrings: true
      },
      app: true,
      agent: false,
    },

  };

  Object.assign(config, ret);
};

'use strict';

const mock = require('egg-mock');

describe('test/session-mysql.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/session-mysql-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, sessionMysql')
      .expect(200);
  });
});

const { assert } = require('chai');
const indexRoute = require('../../../../app/start-pages-sub-app/routes/index.js');

describe('Index route', () => {
  const res = {
    status: () => ({
      render: () => {},
    }),
    render: () => {},
    redirect: () => {},
  };
  const reqEnglish = {
    query: {
      lang: 'en',
    },
  };
  const reqWelsh = {
    query: {
      lang: 'cy',
    },
  };
  it('should redirect to english /who-is-applying', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/who-is-applying');
        assert.equal(statusCode, 302);
      },
    });
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/');
        callback(reqEnglish, res);
      },
    };
    indexRoute(router);
  });
  it('should redirect to welsh /who-is-applying', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/who-is-applying?lang=cy');
        assert.equal(statusCode, 302);
      },
    });
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/');
        callback(reqWelsh, res);
      },
    };
    indexRoute(router);
  });
});

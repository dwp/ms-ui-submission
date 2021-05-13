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
  it('should redirect to /eligibility-start', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/eligibility-start');
        assert.equal(statusCode, 302);
      },
    });
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/');
        callback({}, res);
      },
    };
    indexRoute(router);
  });
});

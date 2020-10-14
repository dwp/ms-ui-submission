const { assert } = require('chai');
const indexRoute = require('../../../../app/start-pages-sub-app/routes/index.js');

describe('Index route', () => {
  it('should render the welcome page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'welcome.njk');
      },
    };
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/');
        callback({}, res);
      },
    };
    indexRoute(router);
  });
});

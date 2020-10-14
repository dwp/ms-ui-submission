const { assert } = require('chai');
const indexRoute = require('../../../../app/start-pages-sub-app/routes/before-you-start.js');

describe('before-you-start route', () => {
  it('should render the before-you-start page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'before-you-start.njk');
      },
    };
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/before-you-start');
        callback({}, res);
      },
    };
    indexRoute(router);
  });
});

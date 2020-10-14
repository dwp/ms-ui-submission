const { assert } = require('chai');
const accessibilityRoute = require('../../../app/routes/eligibility-start.js');

describe('accessibilityRoute route', () => {
  it('should render the eligibility-start page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'pages/eligibility-start.njk');
      },
    };
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/eligibility-start');
        callback({}, res);
      },
    };
    accessibilityRoute(router);
  });
});

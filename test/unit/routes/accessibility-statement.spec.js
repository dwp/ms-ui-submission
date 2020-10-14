const { assert } = require('chai');
const accessibilityRoute = require('../../../app/routes/accessibility-statement.js');

describe('accessibilityRoute route', () => {
  it('should render the accessibility-statement page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'pages/accessibility-statement.njk');
      },
    };
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/accessibility-statement');
        callback({}, res);
      },
    };
    accessibilityRoute(router);
  });
});

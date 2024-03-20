import { assert } from 'chai';
import accessibilityRoute from '../../../src/routes/accessibility-statement.js';

describe('accessibilityRoute route', () => {
  it('should render the accessibility-statement page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'pages/accessibility-statement.njk');
      },
      locals: {
        casa: {},
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

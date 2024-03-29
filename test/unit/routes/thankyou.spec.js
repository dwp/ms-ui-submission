import { assert } from 'chai';
import thankyouRoute from '../../../src/routes/thankyou.js';

describe('Thankyou route', () => {
  it('should render the thankyou page', () => {
    const res = {
      render: (template) => {
        assert.equal(template, 'pages/thankyou.njk');
      },
    };
    const router = {
      get: (path, callback) => {
        assert.equal(path, '/thankyou');
        callback({}, res);
      },
    };
    thankyouRoute(router);
  });
});

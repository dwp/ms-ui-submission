import sinon from 'sinon';

import { assert } from 'chai';

import index from '../../../../src/middleware/navigation-override/index.js';
import backLinkRoute from "../../../../src/middleware/navigation-override/back-link-route.js";

describe('navigation-override middleware', () => {
  it('should call router.use', () => {
    /* eslint-disable-next-line no-underscore-dangle */
    sinon.stub(backLinkRoute, 'backLinkRoute');
    const router = {
      use: sinon.stub(),
    };
    index(router);
    assert(router.use.called);
    // assert(backRoute);
  });
});

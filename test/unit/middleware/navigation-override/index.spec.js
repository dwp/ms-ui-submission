const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');

const { assert } = chai;
const index = rewire('../../../../app/middleware/navigation-override');

describe('navigation-override middleware', () => {
  it('should call router.use', () => {
    const backLinkRoute = sinon.stub();
    /* eslint-disable-next-line no-underscore-dangle */
    index.__set__('backLinkRoute', backLinkRoute);
    const router = {
      use: sinon.stub(),
    };
    index(router);
    assert(router.use.called);
    // assert(backRoute);
  });
});

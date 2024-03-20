import { assert, expect } from 'chai';
import sinon from 'sinon';

import timeoutHelper from '../../../src/middleware/timeout-helper.js';

describe('Timeout Helper', () => {
  it('should do nothing if res.locals doesn\'t exist', () => {
    const next = sinon.stub();
    const router = {
      cookieParserMiddleware: {},
      ancillaryRouter: {
        prependUse: ({}, callback) => {
          callback({}, {}, next);
        },
      },
    };
    const helper = timeoutHelper(router);
    helper.bootstrap(router);
    assert(next.called);
  });
  it('should set default values on the timeout object and assign it to res.locals', () => {
    const res = {
      locals: {},
    };
    const router = {
      cookieParserMiddleware: {},
      ancillaryRouter: {
        prependUse: ({}, callback) => {
          callback({}, res, () => {
            expect(res.locals.timeout).to.be.an('object');
            expect(res.locals.timeout).to.have.own.property('sessionTimeout', 0);
            expect(res.locals.timeout).to.have.own.property('sessionExpiry', false);
            expect(res.locals.timeout).to.have.own.property('refreshDestination', '/');
            expect(res.locals.timeout).to.have.own.property('startPageAfterTimeout', 'eligibility-start');
          });
        },
      },
    };
    const helper = timeoutHelper(router);
    helper.bootstrap(router);
  });
  it('should set supplied values on the timeout object and assign it to res.locals', () => {
    process.env.SESSIONS_TTL = 3600;
    const date = Date.now();
    const res = {
      locals: {},
    };
    const req = {
      session: {
        dateExpire: date,
      },
      url: 'http://localhost:3000/tes-url',
    };
    const router = {
      cookieParserMiddleware: {},
      ancillaryRouter: {
        prependUse: ({}, callback) => {
          callback(req, res, () => {
            expect(res.locals.timeout).to.be.an('object');
            expect(res.locals.timeout).to.have.own.property('sessionTimeout', 60);
            expect(res.locals.timeout).to.have.own.property('sessionExpiry', date);
            expect(res.locals.timeout).to.have.own.property('refreshDestination', 'http://localhost:3000/tes-url');
            expect(res.locals.timeout).to.have.own.property('startPageAfterTimeout', 'eligibility-start');
          });
        },
      },
    };
    const helper = timeoutHelper(router);
    helper.bootstrap(router);
  });
});

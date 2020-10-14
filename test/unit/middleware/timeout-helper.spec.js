const { assert, expect } = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');

const timeoutHelper = rewire('../../../app/middleware/timeout-helper');

describe('Timeout Helper', () => {
  it('should do nothing if res.locals doesn\'t exist', () => {
    const next = sinon.stub();
    const router = {
      use: (callback) => {
        callback({}, {}, next);
      },
    };
    timeoutHelper(router);
    assert(next.called);
  });
  it('should set default values on the timeout object and assign it to res.locals', () => {
    const res = {
      locals: {},
    };
    const router = {
      use: (callback) => {
        callback({}, res, () => {
          expect(res.locals.timeout).to.be.an('object');
          expect(res.locals.timeout).to.have.own.property('sessionTimeout', 0);
          expect(res.locals.timeout).to.have.own.property('sessionExpiry', false);
          expect(res.locals.timeout).to.have.own.property('refreshDestination', '/');
          expect(res.locals.timeout).to.have.own.property('startPageAfterTimeout', 'eligibility-start');
        });
      },
    };
    timeoutHelper(router);
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
      use: (callback) => {
        callback(req, res, () => {
          expect(res.locals.timeout).to.be.an('object');
          expect(res.locals.timeout).to.have.own.property('sessionTimeout', 60);
          expect(res.locals.timeout).to.have.own.property('sessionExpiry', date);
          expect(res.locals.timeout).to.have.own.property('refreshDestination', 'http://localhost:3000/tes-url');
          expect(res.locals.timeout).to.have.own.property('startPageAfterTimeout', 'eligibility-start');
        });
      },
    };
    timeoutHelper(router);
  });
});

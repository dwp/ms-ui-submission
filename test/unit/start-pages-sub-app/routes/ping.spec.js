const chai = require('chai');

const { expect } = chai;
const ping = require('../../../../app/start-pages-sub-app/routes/ping.js');

describe('ping', () => {
  it('should set up a ping route handler', () => {
    const res = {
      status: (status) => {
        expect(status).to.equal(204);
        return {
          send: () => {},
        };
      },
    };
    const router = {
      get: (route, middleware, callback) => {
        expect(route).to.equal('/ping');
        callback({}, res);
      },
    };
    ping(router);
  });
});

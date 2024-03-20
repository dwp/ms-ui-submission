import { expect } from 'chai';
import pingDefault from '../../../../app/start-pages-sub-app/routes/ping.js';

const ping = pingDefault;

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
      get: (route, callback) => {
        expect(route).to.equal('/ping');
        callback({}, res);
      },
    };
    ping(router);
  });
});

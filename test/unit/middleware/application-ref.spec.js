const { expect } = require('chai');
const appRef = require('../../../app/middleware/application-ref.js');
const journey = require('../../../app/definitions/journey');

describe('Application ref', () => {
  it('should exist', () => expect(appRef).to.not.be.undefined);

  it('should set middleware on the get-universal-credit page', () => {
    const startPage = journey.allWaypoints()[0];

    const router = {
      all: (path) => {
        expect(path).to.equal('/coronavirus');
      },
    };
    appRef(router, null, startPage);
  });

  it('should set a spoofed app ref if one isnt defined', () => {
    const req = {
      session: {
        id: 'test123',
        save: () => {},
      },
    };
    const router = {
      all: (path, callback) => {
        callback(req, {}, () => {
          expect(req.session.applicationRef).to.equal('TEST1');
        });
      },
    };
    appRef(router);
  });

  it('should set an app ref from redis if one isnt defined', () => {
    const req = {
      session: {
        id: 'test123',
        save: () => {},
      },
    };
    const router = {
      all: (path, callback) => {
        callback(req, {}, () => {
          expect(req.session.applicationRef).to.equal('2PJE5M');
        });
      },
    };
    const redis = {
      incr: () => Promise.resolve(1),
    };
    appRef(router, redis);
  });

  it('should render an error page if redis isnt behaving', () => {
    const req = {
      session: {
        id: 'test123',
        save: () => {},
      },
    };
    const res = {
      status: (code) => ({
        render: (template) => {
          expect(code).to.equal(503);
          expect(template).to.equal('casa/errors/503.njk');
        },
      }),
    };
    const router = {
      all: (path, callback) => {
        callback(req, res, () => {
          expect(req.session.applicationRef).to.equal('2PJE5M');
        });
      },
    };
    const redis = {
      incr: () => Promise.reject(new Error('no redis')),
    };
    appRef(router, redis);
  });

  it('shouldnt set an app ref if one is already defined', () => {
    const req = {
      session: {
        id: 'test123',
        applicationRef: 'APPLICATION-REF',
        save: () => {},
      },
    };
    const router = {
      all: (path, callback) => {
        callback(req, {}, () => {
          expect(req.session.applicationRef).to.equal('APPLICATION-REF');
        });
      },
    };
    appRef(router);
  });
});

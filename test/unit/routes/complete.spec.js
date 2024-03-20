import { assert } from 'chai';
import completeRoute from '../../../src/routes/complete.js';

describe('Complete route', () => {
  const casaApp = {};
  const mountUrl = '/';
  const req = {
    language: 'en',
    csrfToken: () => '',
    i18nTranslator: ({
      t: () => this,
      getLanguage: () => 'en',
    }),
    casa: {
      journeyContext: {},
    },
    session: {
      cyaVisited: true,
      save: (cb) => {
        cb(new Error('save error'));
      },
      destroy: (cb) => {
        cb();
      },
      employmentGather: [
        {
          employerName: 'Smiths',
          frequency: 'weekly',
          workTypes: ['employee'],
        },
        {
          employerName: 'Browns',
          frequency: 'monthly',
          workTypes: ['subContractor'],
        },
      ],
      pensionGather: {},
      insuranceGather: {},
      journeyContext: {
        conditions: [],
        nino: 'test',
        pension: {},
        'universal-credit': {},
        'live-less-than-12-months': {},
        sortCode: {
          sortCode: '010101',
        },
        claimStartDate: {
          dd: '1',
          mm: '1',
          yyyy: '1111',
        },
        dateOfBirth: {
          dd: '1',
          mm: '1',
          yyyy: '1111',
        },
        address: {
          address1: 'test',
          address2: 'test',
          address3: 'test',
          postcode: 'test',
        },
        employed: {
          employed: 'yes',
        },
        'statutory-sick-pay': {
          ssp: 'yes',
        },
        'statutory-sick-pay-recent': {
          sspRecent: 'yes',
        },
      },
    },
  };

  const res = {
    status: () => ({
      render: () => {
      },
    }),
  };
  const router = {};
  it('should set up a GET route, and render the complete page', (done) => {
    res.redirect = () => done();
    res.render = (template) => {
      try {
        assert.equal(template, 'pages/complete.njk');
        done();
      } catch (e) {
        done(e);
      }
    };
    router.get = (path, callback) => {
      assert.equal(path, '/complete');
      callback(req, res);
    };
    completeRoute(casaApp, mountUrl, router);
  });

  it('should render the complete page if the session does not end successfully', (done) => {

    req.session.destroy = (cb) => {
      cb(new Error({
        message: 'oh no!',
        stack: {},
      }));
    };
    res.render = (template) => {
      try {
        assert.equal(template, 'pages/complete.njk');
        done();
      } catch (e) {
        done(e);
      }
    };
    router.get = (path, callback) => {
      assert.equal(path, '/complete');
      callback(req, res);
    };
    completeRoute(casaApp, mountUrl, router);
  });

  describe('Data for /complete', () => {
    it('should set displaySSP1Content to true when \'employee\' selected on /employment-status and \'yes\' on /statutory-sick-pay-rent', (done) => {
      const testReq = {
        ...req,
        journeyData: {
          getData: () => (
            {
              ...req.casa.journeyContext.getData(),
              sspRecent: 'yes',
            }),
        },
      };

      req.session.destroy = (cb) => {
        cb();
      };
      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isTrue(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to true when \'employee\' selected on /employment-status and \'no\' on /statutory-sick-pay-rent', (done) => {
      const testReq = {
        ...req,
        journeyData: {
          getData: () => (
            {
              ...req.casa.journeyContext.getData(),
              sspRecent: 'no',
            }),
        },
      };

      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isTrue(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to true when \'No, I\'m unemployed\' is selected on /employed and \'yes\' on /statutory-sick-pay-rent', (done) => {
      const testReq = {
        ...req,
        session: {
          ...req.session,
          employmentGather: undefined,
        },
        journeyData: {
          getData: () => (
            {
              ...req.casa.journeyContext.getData(),
              employed: 'no',
              sspRecent: 'yes',
            }),
        },
      };

      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isTrue(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to false when \'No, I\'m unemployed\' is selected on /employed and \'no\' on /statutory-sick-pay-rent', (done) => {
      const testReq = {
        ...req,
        session: {
          ...req.session,
          employmentGather: undefined,
        },
      };
      testReq.session.journeyContext.employed.employed = 'no';
      testReq.session.journeyContext['statutory-sick-pay-recent'].sspRecent = 'no';

      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isFalse(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to false when \'employee\' isn\'t selected on /employment-status', (done) => {
      const testReq = {
        ...req,
        session: {
          ...req.session,
          employmentGather: [
            {
              employerName: 'Browns',
              frequency: 'monthly',
              workTypes: ['subContractor'],
            },
          ],
        },
      };

      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isFalse(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to false when \'yes\' is selected on /live-less-than-12-months page', (done) => {
      const testReq = {
        ...req,
      };
      testReq.session.journeyContext['live-less-than-12-months'].severeCondition = 'yes';

      res.redirect = () => done();
      res.render = (template, { displaySSP1Content }) => {
        try {
          assert.isFalse(displaySSP1Content);
          done();
        } catch (e) {
          done(e);
        }
      };
      router.get = (path, callback) => {
        assert.equal(path, '/complete');
        callback(testReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });
  });
});

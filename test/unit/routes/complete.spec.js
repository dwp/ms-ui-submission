const { assert } = require('chai');
const completeRoute = require('../../../app/routes/complete.js');

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
    session: {
      cyaVisited: true,
      save: (cb) => {
        cb(new Error('save error'));
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
      journeyData: {
        getDataForPage: () => ({
          conditions: [],
          nino: 'test',
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
        }),
      },
    },
    journeyData: {
      getDataForPage: () => ({
        conditions: [],
        nino: 'test',
        sortCode: {
          sortCode: '010101',
        },
        claimStartDate: {
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
      }),
    },
  };

  const covidReq = {
    language: 'en',
    csrfToken: () => '',
    i18nTranslator: ({
      t: () => this,
      getLanguage: () => 'en',
    }),
    session: {
      cyaVisited: true,
      save: (cb) => {
        cb(new Error('save error'));
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
      journeyData: {
        getDataForPage: () => ({
          conditions: [],
          nino: 'test',
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
        }),
      },
    },
    journeyData: {
      getDataForPage: () => ({
        conditions: [],
        nino: 'test',
        sortCode: {
          sortCode: '010101',
        },
        claimStartDate: {
          dd: '1',
          mm: '1',
          yyyy: '1111',
        },
        coronavirusReasonForClaim: 'yes',
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
      }),
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
    casaApp.endSession = () => Promise.resolve();
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

  it('should set up a GET route, and render the complete coronavirus page when covid claim', (done) => {
    casaApp.endSession = () => Promise.resolve();
    res.redirect = () => done();
    res.render = (template) => {
      try {
        assert.equal(template, 'pages/complete-coronavirus.njk');
        done();
      } catch (e) {
        done(e);
      }
    };
    router.get = (path, callback) => {
      assert.equal(path, '/complete');
      callback(covidReq, res);
    };
    completeRoute(casaApp, mountUrl, router);
  });

  it('should render the complete page if the session does not end successfully', (done) => {
    casaApp.endSession = () => Promise.reject(new Error({
      message: 'oh no!',
      stack: {},
    }));
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
          getDataForPage: () => (
            {
              ...req.journeyData.getDataForPage(),
              sspRecent: 'yes',
            }),
        },
      };

      casaApp.endSession = () => Promise.resolve();
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
          getDataForPage: () => (
            {
              ...req.journeyData.getDataForPage(),
              sspRecent: 'no',
            }),
        },
      };

      casaApp.endSession = () => Promise.resolve();
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
          getDataForPage: () => (
            {
              ...req.journeyData.getDataForPage(),
              employed: 'no',
              sspRecent: 'yes',
            }),
        },
      };

      casaApp.endSession = () => Promise.resolve();
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
        journeyData: {
          getDataForPage: () => (
            {
              ...req.journeyData.getDataForPage(),
              employed: 'no',
              sspRecent: 'no',
            }),
        },
      };

      casaApp.endSession = () => Promise.resolve();
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

      casaApp.endSession = () => Promise.resolve();
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

    it('should set displaySSP1Content to false when \'yes\' is selected on /coronavirus page', (done) => {
      casaApp.endSession = () => Promise.resolve();
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
        callback(covidReq, res);
      };
      completeRoute(casaApp, mountUrl, router);
    });

    it('should set displaySSP1Content to false when \'yes\' is selected on /live-less-than-6-months page', (done) => {
      const testReq = {
        ...req,
        journeyData: {
          getDataForPage: () => (
            {
              ...req.journeyData.getDataForPage(),
              severeCondition: 'yes',
            }),
        },
      };

      casaApp.endSession = () => Promise.resolve();
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

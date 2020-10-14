const { assert } = require('chai');
const completeRoute = require('../../../app/routes/complete.js');

describe('Complete route', () => {
  const casaApp = {};
  const mountUrl = '/';
  const req = {
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
        },
        {
          employerName: 'Browns',
          frequency: 'monthly',
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
});

import { assert, expect } from 'chai';
import sinon from 'sinon';
import declarationRoute from '../../../src/routes/declaration.js';

describe('Declaration routes', () => {
  const casaApp = {};
  const mountUrl = '/';
  const req = {
    csrfToken: () => '',
    t: () => this,
    i18nTranslator: ({
      t: () => this,
      getLanguage: () => 'en',
    }),
    casa: {},
    session: {
      conditionGather: [{
        conditionName: 'test1',
        conditionStartDate: {
          dd: '01',
          mm: '1',
          yyyy: '2001',
        },
      }],
      save: (cb) => {
        cb(new Error('save error'));
      },
      destroy: (cb) => {
        cb();
      },
      applicationRef: 'test',
      journeyContext: {
        'date-of-birth': {
          dateOfBirth: {
            dd: '01',
            mm: '1',
            yyyy: '2020',
          },
        },
        name: {
          firstName: 'test',
          lastName: 'test',
        },
        address: {
          correspondence: 'no',
          address: {
            address1: 'test',
            address2: 'test',
            address3: 'test',
            postcode: 'test',
          },
        },
        'correspondence-address': {
          correspondenceAddress: {
            address1: 'test',
            address2: 'test',
            address3: 'test',
            postcode: 'test',
          },
        },
        postcode: {
          welsh: true,
        },
        'language-preference-writing': {
          langPrefWriting: 'yes',
        },
        'language-preference-speaking': {
          langPrefSpeaking: 'yes',
        },
        mobile: {
          mobile: 'no',
        },
        'other-number': {
          other: 'no',
        },
        email: {
          emailProvided: 'yes',
          email: 'username@domain.com',
        },
        'hospital-inpatient': {
          hospitalInpatient: 'yes',
        },
        'hospital-details': {
          admissionDate: {
            dd: '01',
            mm: '01',
            yyyy: '0101',
          },
        },
        'hospital-planned': {
          hospitalPlanned: 'yes',
          admissionDate: {
            dd: '01',
            mm: '01',
            yyyy: '0101',
          },
        },
        'doctor-declaration': {
          docShareWithDWP: 'yes',
        },
        'consent-outcome': {
          dwpShareWithDoc: 'yes',
        },
        'work-overseas': {
          workOverseas: 'yes',
        },
        'military-overseas': {
          militaryOverseas: 'yes',
        },
        'statutory-sick-pay': {
          ssp: 'yes',
        },
        'reason-no-sick-pay': {
          statutoryPayNoReason: '',
        },
        'statutory-sick-pay-end': {
          sspEndDate: {
            dd: '01',
            mm: '01',
            yyyy: '0101',
          },
        },
        'statutory-sick-pay-recent': {
          sspRecent: 'yes',
        },
        'statutory-pay-other': {
          statutoryPayOther: 'none',
        },
        'voluntary-work': {
          screen: 'voluntary-work',
        },
        'claim-end-date': {
          claimEnd: 'yes',
          claimEndDate: '2020-11-2',
        },
        consent: {
          consent: 'yes',
        },
        'another-health-condition': {
          anotherCondition: 'yes',
          limitReached: 'no',
        },
        employed: {
          screen: 'employed',
        },
        pension: {
          screen: 'pension',
        },
        insurance: {
          screen: 'insurance',
        },
        'national-insurance-number': {
          nino: 'AA370773A',
        },
        pregnant: {
          pregnant: 'yes',
        },
        'pregnant-due-date': {
          dueDate: {
            dd: '01',
            mm: '01',
            yyyy: '0101',
          },
        },
        'live-less-than-12-months': {
          severeCondition: 'yes',
        },
        'sr1-report': {
          sr1Report: 'yes',
        },
        'bank-details': {
          accountName: 'test',
          sortCode: '010101',
          accountNumber: 'test',
          rollNumber: 'test',
        },
        'medical-centre': {
          name: 'test',
          tel: 'test',
          doctor: 'test',
          address: {
            address1: 'test',
            address2: 'test',
            address3: 'test',
            postcode: 'test',
          },
        },
        'universal-credit': {
          universalCredit: 'yes',
        },
        'claim-start-date-after-statutory-sick-pay': {
          claimStartDateAfterSsp: 'yes',
        },
        'claim-start-date': {
          claimStartDate: {
            dd: '01',
            mm: '1',
            yyyy: '2020',
          },
        },
        coronavirus: {
          coronavirusReasonForClaim: 'yes',
        },
        'coronavirus-reason-for-claim': {
          coronavirusReasonForClaim: 'high-risk',
        },
        'coronavirus-date': {
          coronavirusDate: {
            dd: '01',
            mm: '01',
            yyyy: '2020',
          },
        },
        'coronavirus-other-condition': {
          coronavirusOtherCondition: 'yes',
        },
      },
    },
    // journeyData: {
    //   getData: () => ({
    //     name: {
    //       firstName: 'aa',
    //       surname: 'dd',
    //     },
    //     nino: 'test',
    //     sortCode: '010101',
    //     accountNumber: '01 01 01 01',
    //     claimStartDate: {
    //       dd: '1',
    //       mm: '1',
    //       yyyy: '1111',
    //     },
    //     'date-of-birth': {
    //       dob: {
    //         dd: '1',
    //         mm: '1',
    //         yyyy: '1111',
    //       },
    //     },
    //     address: {
    //       address1: 'test',
    //       address2: 'test',
    //       address3: 'test',
    //       postcode: 'test',
    //     },
    //   }),
    // },
  };
  const res = {
    status: () => ({
      render: () => {},
      redirect: () => {},
    }),
  };
  const router = {};
  const csrf = '';
  const submissionService = {
    sendApplication: () => Promise.resolve({
      statusCode: 200,
    }),
  };
  const notificationService = {
    sendNotification: () => Promise.resolve({
      statusCode: 202,
    }),
  };

  it('should set up a GET route, and render the declaration page when called with cya page already visited', () => {
    const next = sinon.stub();
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      req.session.cyaVisited = true;
      callback(req, res, next);
    };
    router.post = () => {};
    casaApp.post = () => {};
    declarationRoute(casaApp, mountUrl, router, csrf);
    assert(next.calledOnce);
  });

  it('should redirect to welcome page when declaration page called without visiting cya page', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/welcome');
        assert.equal(statusCode, 302);
      },
    });
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      const request = { session: {}, casa: {} };
      callback(request, res);
    };
    router.post = () => {};
    casaApp.post = () => {};
    declarationRoute(casaApp, mountUrl, router, csrf);
  });

  it('should set up a POST route, and redirect to the complete page when submission service successful', (done) => {
    router.get = () => {};
    casaApp.post = () => {};
    const next = sinon.stub();
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res, next);
    };
    declarationRoute(casaApp, mountUrl, router, csrf, submissionService, notificationService);
    done();
    assert(next.calledOnce);
  });

  it('should display an error page if submission handler doesn\'t accept the app', (done) => {
    res.status = (statusCode) => ({
      render: (path) => {
        try {
          assert.equal(path, 'casa/errors/500-submission-error.njk');
          assert.equal(statusCode, 500);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      sendApplication: () => Promise.resolve({
        statusCode: 400,
      }),
    };
    declarationRoute(casaApp, mountUrl, router, csrf, badSubmissionService, notificationService);
  });
  //
  it('should route to the complete page if submission handler doesn\'t accept application because it\'s a duplicate submission', (done) => {
    router.get = () => {};
    const next = sinon.stub();
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res, next);
    };
    const badSubmissionService = {
      // eslint-disable-next-line prefer-promise-reject-errors
      sendApplication: () => Promise.reject({
        statusCode: 409,
      }),
    };
    declarationRoute(casaApp, mountUrl, router, csrf, badSubmissionService, notificationService);
    done();
    assert(next.calledOnce);
  });
  it('should display an error page if submission handler isn\'t working', (done) => {
    res.status = (statusCode) => ({
      render: (path) => {
        try {
          assert.equal(path, 'casa/errors/500-submission-error.njk');
          assert.equal(statusCode, 500);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      sendApplication: () => Promise.reject(new Error('something bad happened')),
    };
    declarationRoute(casaApp, mountUrl, router, csrf, badSubmissionService, notificationService);
  });
  it('should display an error page if submission handler gives bad request and end the session', (done) => {
    res.status = (statusCode) => ({
      render: (path) => {
        try {
          assert.equal(path, 'casa/errors/400-submission-error.njk');
          assert.equal(statusCode, 400);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      // eslint-disable-next-line prefer-promise-reject-errors
      sendApplication: () => Promise.reject({
        statusCode: 400,
      }),
    };
    casaApp.post = () => {};
    declarationRoute(casaApp, mountUrl, router, csrf, badSubmissionService, notificationService);
  });
});

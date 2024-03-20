import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import NotifyService from '../../../src/lib/NotifyService.js';

chai.use(chaiAsPromised);

describe('Notify service', () => {
  const notifyTemplateData = {
    screen: 'conditions',
    rating: 'Satisfied',
    comments: '',
  };
  let notifyApiKey = 'healthapplyfeedback_test-53ddab3f-cad3-4a0e-a6a6-d94733679b09-cb26963a-efe1-4d2e-bca8-cb2155e372ab';
  const notifyEmailTo = 'quarryhouse.applyfornewstyleesafeedback@dwp.gov.uk';
  const notifyProxy = null;
  const notifyUrl = 'http://localhost';
  it('should set up the notify service, send a feedback email, and return a resolved promise', (done) => {
    assert.isFulfilled(
      NotifyService.notifyEmail(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl),
    );
    done();
  });
  it('should return a rejected promise if it gets an error from the notify service', (done) => {
    notifyApiKey = 'test';
    assert.isRejected(
      NotifyService.notifyEmail(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl),
    );
    done();
  });
});

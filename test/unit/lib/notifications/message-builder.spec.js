import { expect } from 'chai';
import buildSMSMessage from '../../../../src/lib/notifications/message-builder.js';

describe('when buildMessage is called', () => {
  it('returns a correctly built message object', () => {
    const id = '12345';
    const templateID = 'test template ID';
    const mobileNumber = '07123456789';
    const apiKey = 'Test-Api-Key';

    const expectedresponse = {
      notificationId: id,
      clientApiKey: apiKey,
      notificationTemplate: templateID,
      notificationDestination: mobileNumber,
      notificationType: 'sms',
      notificationData: [],
    };

    const response = buildSMSMessage(id, templateID, mobileNumber, apiKey);

    expect(response).to.be.a('object');
    expect(response).to.deep.equal(expectedresponse);
  });
});

const sinon = require('sinon');
const chai = require('chai');
const cryptoUtils = require('../../../app/utils/cryptoUtils');
const messagePublisherDao = require('../../../app/dao/messagePublisherDao');


const { assert } = chai;

describe('when processNotifications is called', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call publishMessage with an encrypted message and return the received promise', async () => {
    const mobileNumber = '07123456789';
    const templateId = 'Test Id';
    const config = {
      SMS_API_KEY: 'Test API Key',
      QUEUE_URL: 'https://test.sqs',
      SQS_AWS_REGION: 'eu-west-2',
      ENC_KEY_ALIAS: 'testKey',
    };
    const encryptedMessage = 'UFt7d743gidbguywfgwre';
    const awsResponse = { MessageId: '1234567890' };

    const encryptMessageBodyMock = sinon.mock(cryptoUtils);
    const messagePublisherDaoMock = sinon.mock(messagePublisherDao);

    encryptMessageBodyMock.expects('encryptMessageBody').once().resolves(encryptedMessage);
    messagePublisherDaoMock.expects('publishMessage').once().resolves(awsResponse);

    const { processNotifications } = require('../../../app/services/NotificationService');

    const response = await processNotifications(mobileNumber, templateId, config);

    assert.equal(response, awsResponse);

    encryptMessageBodyMock.verify();
    messagePublisherDaoMock.verify();
  });
});

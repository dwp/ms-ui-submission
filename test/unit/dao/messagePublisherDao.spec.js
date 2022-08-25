const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { assert } = chai;

const { mockClient } = require('aws-sdk-client-mock');
const { publishMessage } = require('../../../app/dao/messagePublisherDao');

describe('when publishMessage is called', () => {
  let sqsMock;

  const config = {
    QUEUE_URL: 'https://test.sqs',
    SQS_AWS_REGION: 'eu-west-2',
  };

  beforeEach(() => {
    sqsMock = mockClient(SQSClient);
  });

  afterEach(() => {
    sqsMock.reset();
  });

  it('should return a resolved promise when AWS successsfully sends the SQS message', (done) => {
    sqsMock
      .on(SendMessageCommand)
      .resolves({
        MessageId: '12345678-1111-2222-3333-111122223333',
      });

    assert.isFulfilled(
      publishMessage('hello world', config),
    );
    done();
  });

  it('should return a rejected promise when AWS unsuccesssfully sends the SQS message', (done) => {
    sqsMock
      .on(SendMessageCommand)
      .rejects();

    assert.isRejected(
      publishMessage('hello world', config),
    );
    done();
  });
});

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import pkg from 'aws-sdk-client-mock';
import messagePublisherDao from '../../../app/dao/messagePublisherDao.js';

const { mockClient } = pkg;

chai.use(chaiAsPromised);

const { assert } = chai;

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
      messagePublisherDao.publishMessage('hello world', config),
    );
    done();
  });

  it('should return a rejected promise when AWS unsuccesssfully sends the SQS message', (done) => {
    sqsMock
      .on(SendMessageCommand)
      .rejects();

    assert.isRejected(
      messagePublisherDao.publishMessage('hello world', config),
    );
    done();
  });
});

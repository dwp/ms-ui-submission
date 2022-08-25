const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

exports.publishMessage = (message, config, msgAttributes = {}) => {
  const { SQS_ENDPOINT_OVERRIDE, SQS_AWS_REGION, QUEUE_URL } = config;

  const clientConfig = { region: SQS_AWS_REGION };

  if (typeof SQS_ENDPOINT_OVERRIDE !== 'undefined' && SQS_ENDPOINT_OVERRIDE != null) {
    clientConfig.endpoint = config.SQS_ENDPOINT_OVERRIDE;
  }

  const client = new SQSClient(clientConfig);
  const command = new SendMessageCommand({
    MessageBody: message,
    QueueUrl: QUEUE_URL,
    MessageAttributes: msgAttributes,
  });

  return client.send(command);
};

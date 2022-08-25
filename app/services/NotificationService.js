const { v4: uuidv4 } = require('uuid');
const Logger = require('../lib/Logger');
const cryptoUtil = require('../utils/cryptoUtils');
const { publishMessage } = require('../dao/messagePublisherDao');
const { buildSMSMessage } = require('../lib/notifications/message-builder');

const appLogger = Logger();

async function encryptMessageIfNeeded(messageBody, config) {
  return JSON.stringify((config.ENC_KEY_ALIAS)
    ? await cryptoUtil.encryptMessageBody(messageBody, config) : messageBody);
}

async function processMessage(mobileNo, smsTemplateId, config) {
  const id = uuidv4();
  const smsAPIKey = config.SMS_API_KEY;
  const messageObject = buildSMSMessage(
    id,
    smsTemplateId,
    mobileNo,
    smsAPIKey,
  );
  const messageAsString = await encryptMessageIfNeeded(messageObject, config);

  return publishMessage(
    messageAsString,
    config,
  );
}

exports.processNotifications = async (mobileNo, smsTemplateId, config) => {
  appLogger.info('Processing SMS notification');
  return processMessage(mobileNo, smsTemplateId, config);
};

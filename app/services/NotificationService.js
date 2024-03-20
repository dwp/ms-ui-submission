import { v4 as uuidv4 } from 'uuid';
import Logger from '../../src/lib/logger.js';
import cryptoUtils from '../utils/cryptoUtils.js';
import messagePublisherDao from '../dao/messagePublisherDao.js';
import buildSMSMessage from '../../src/lib/notifications/message-builder.js';

const appLogger = Logger();

const encryptMessageIfNeeded = async (messageBody, config) => JSON.stringify((config.ENC_KEY_ALIAS)
  ? await cryptoUtils.encryptMessageBody(messageBody, config) : messageBody);

const processMessage = async (mobileNo, smsTemplateId, config) => {
  const id = uuidv4();
  const smsAPIKey = config.SMS_API_KEY;
  const messageObject = buildSMSMessage(
    id,
    smsTemplateId,
    mobileNo,
    smsAPIKey,
  );
  const messageAsString = await encryptMessageIfNeeded(messageObject, config);

  return messagePublisherDao.publishMessage(
    messageAsString,
    config,
  );
};

const processNotifications = async (mobileNo, smsTemplateId, config) => {
  appLogger.info('Processing SMS notification');
  return processMessage(mobileNo, smsTemplateId, config);
};

export default {
  encryptMessageIfNeeded,
  processMessage,
  processNotifications,
};

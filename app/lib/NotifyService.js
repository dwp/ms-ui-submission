const { NotifyClient } = require('notifications-node-client');
const Logger = require('./Logger');

const appLogger = Logger();

const notifyEmail = (notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl) => {
  appLogger.info('NotifyService: Set up notifyClient and send email via notify service');
  const reference = '';
  const notifyClient = notifyUrl === null ? new NotifyClient(notifyApiKey) : new NotifyClient(notifyUrl, notifyApiKey); // eslint-disable-line max-len
  notifyClient.setProxy(notifyProxy);
  return notifyClient
    .sendEmail('54c460ea-9bd1-4348-b134-cbd0e6a6eecb', notifyEmailTo, {
      personalisation: notifyTemplateData,
      reference,
    });
};

module.exports.notifyEmail = notifyEmail;

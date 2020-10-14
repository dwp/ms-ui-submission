const rp = require('request-promise-native');
const Logger = require('./Logger');

const appLogger = Logger();

/**
   * NotificationService.
*/
class NotificationService {
  /**
   * Constructor.
   *
   * @param  {sting} serviceUrl Service URL
   */
  constructor(serviceUrl) {
    if (typeof serviceUrl === 'undefined') {
      throw new TypeError('Service URL is missing');
    }
    this.serviceUrl = serviceUrl.replace(/\/+$/, '');
  }

  /**
   * Prepare common options for HTTP(S) calls.
   *
   * @return {object} Options object
   */
  prepareRequestOptions() {
    return {
      resolveWithFullResponse: true,
      rejectUnauthorized: true,
      timeout: this.serviceTtl,
    };
  }

  /**
   * Send notification.
   *
   * @param  {object} data Data to transport
   * @return {Promise} Promise
   */
  sendNotification(data) {
    return rp({
      ...this.prepareRequestOptions(),
      method: 'POST',
      uri: `${this.serviceUrl}`,
      json: true,
      body: data,
    })
      .then((res) => res)
      .catch((err) => {
        appLogger.error('NotificationService: Error %s when sending SMS', err);
        throw err;
      });
  }
}

module.exports = NotificationService;

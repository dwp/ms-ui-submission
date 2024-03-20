import rp from 'request-promise-native';
import Logger from './logger.js';

const appLogger = Logger();

/**
 * SubmissionService.
 */
class SubmissionService {
  /**
   * Constructor.
   *
   * @param  {sting} serviceUrl Service URL.
   * @param  {string} apiKey api auth key.
   */
  constructor(serviceUrl, apiKey) {
    this.serviceUrl = serviceUrl.replace(/\/+$/, '');
    this.serviceTtl = 10000; // ms
    this.apiKey = apiKey;
  }

  /**
   * Prepare common options for HTTP(S) calls.
   *
   * @returns {object} Options object.
   */
  prepareRequestOptions() {
    let headers;
    if (this.apiKey) {
      headers = {
        'X-Auth-Api-Key': this.apiKey,
      };
    }
    return {
      resolveWithFullResponse: true,
      rejectUnauthorized: true,
      timeout: this.serviceTtl,
      headers,
    };
  }

  /**
   * Submit the application data to the service.
   *
   * @param  {object} data Data to transport.
   * @returns {Promise} Promise.
   */
  sendApplication(data) {
    return rp({
      ...this.prepareRequestOptions(),
      method: 'POST',
      uri: `${this.serviceUrl}/submission`,
      json: true,
      body: data,
    })
      .then((res) => res)
      .catch((err) => {
        appLogger.error('SubmissionService: Error %s when sending application', err);
        throw err;
      });
  }
}

export default SubmissionService;

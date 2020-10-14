const Logger = require('./Logger');

const appLogger = Logger();

const logLevels = ['debug', 'info', 'error'];

module.exports = (envParam) => {
  const env = envParam;
  /**
   * @param {string} v environment to validate
   * @return {void}
   */
  function validateRequiredString(v) {
    if (typeof env[v] === 'undefined') {
      throw new Error(`${v} is missing`);
    } else if (typeof env[v] !== 'string') {
      throw new Error(`${v} must be a string`);
    } else if (env[v].length === 0) {
      throw new Error(`${v} is missing`);
    }
  }
  /**
   * @param {string} v environment to validate
   * @return {void}
   */
  function validateOptionalString(v) {
    if (env[v] && typeof env[v] !== 'string') {
      throw new Error(`${v} must be a string`);
    }
  }
  /**
   * @param {string} v environment to validate
   * @return {void}
   */
  function validateRequiredInt(v) {
    if (typeof env[v] === 'undefined') {
      throw new Error(`${v} is missing`);
    } else if (Number.isNaN(parseInt(env[v], 10)) || parseInt(env[v], 10) < 0) {
      throw new Error(`${v} must be a positive integer`);
    } else {
      env[v] = parseInt(env[v], 10);
    }
  }
  /**
   * @param {string} v environment to validate
   * @return {void}
   */
  function validateBool(v) {
    if (typeof env[v] !== 'undefined') {
      env[v] = env[v] === 'true';
    } else {
      env[v] = false;
    }
  }

  validateOptionalString('LOG_LEVEL');
  if (env.LOG_LEVEL && !logLevels.includes(env.LOG_LEVEL)) {
    throw new Error('LOG_LEVEL environment config item must have value of debug, info, or error');
  }
  appLogger.info('Validate other environment configuration variables');
  if ((env.DEBUG !== null) && (typeof env.DEBUG !== 'undefined') && (env.DEBUG !== '')) {
    validateRequiredString('DEBUG');
  }

  validateRequiredInt('SERVER_PORT');

  /* --------------------------------------------------------------------- SSL */
  validateBool('SERVER_SSL_ENABLED');

  if (env.SERVER_SSL_ENABLED) {
    validateRequiredString('SERVER_SSL_KEYFILE');
    validateRequiredString('SERVER_SSL_CERTFILE');
    validateRequiredString('SERVER_SSL_CACERTFILE');
  }

  /* --------------------------------------------------------------- sessions */
  validateRequiredString('SESSIONS_SECRET');
  validateRequiredInt('SESSIONS_TTL');

  if (env.REDIS_PORT && env.REDIS_HOST) {
    validateRequiredInt('REDIS_PORT');
    validateRequiredString('REDIS_HOST');
    validateRequiredString('REDIS_KMS_ID');
    validateRequiredString('REDIS_AWS_REGION');
  } else {
    validateRequiredString('SESSIONS_DIR');
  }

  /* -------------------------------------------------------------------- ESA controller api */
  validateRequiredString('ESA_CONTROLLER_URL');
  validateRequiredString('NOTIFICATION_API_URL');

  /* -------------------------------------------------------------------- Notify */
  validateRequiredString('NOTIFY_EMAILTO');
  validateRequiredString('NOTIFY_APIKEY');
  validateRequiredString('NOTIFY_PROXY');
  return env;
};

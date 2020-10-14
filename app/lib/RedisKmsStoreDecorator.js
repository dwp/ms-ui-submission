const Logger = require('./Logger');

const appLogger = Logger();

module.exports = (RedisStoreParam, cryptoService) => {
  const RedisStore = RedisStoreParam;
  const { get, set } = RedisStore.prototype;

  RedisStore.prototype.get = function (sid, callback) { // eslint-disable-line func-names
    return get.call(this, sid, (err, dataParam) => {
      const data = dataParam;
      appLogger.debug('RedisKmsStoreDecorator: Got %s', typeof data, { err, sid });
      if (typeof data === 'object'
                && Object.prototype.hasOwnProperty.call(data, 'ciphertext')
                && Object.prototype.hasOwnProperty.call(data, 'cipherkey')) {
        cryptoService.decrypt({
          ciphertext: Buffer.from(data.ciphertext, 'base64'),
          cipherkey: Buffer.from(data.cipherkey, 'base64'),
        }).then((dec) => {
          delete data.ciphertext;
          delete data.cipherkey;
          const originalData = Object.assign(data, JSON.parse(dec.toString('utf8')));
          callback(null, originalData);
        }).catch((error) => {
          if (error) {
            appLogger.error('RedisKmsStoreDecorator: Get error', error);
          }
          callback(error);
        });
      } else {
        callback(err, data);
      }
    });
  };

  RedisStore.prototype.set = function (sid, session, callback) { // eslint-disable-line func-names
    let sessionString;
    const cookieData = session.cookie || {};
    try {
      sessionString = JSON.stringify(session);
    } catch (ex) {
      appLogger.info('RedisKmsStoreDecorator: Failed to serialize session data. Error : ', ex.message);
      appLogger.debug('RedisKmsStoreDecorator: Failed to serialize session data', {
        err_message: ex.message,
        err_stack: ex.stack,
      });
      callback(ex);
      return false;
    }

    return cryptoService.encrypt({
      plaintext: Buffer.from(sessionString, 'utf8'),
    }).then((enc) => {
      set.call(this, sid, {
        cookie: cookieData,
        ciphertext: enc.ciphertext.toString('base64'),
        cipherkey: enc.cipherkey.toString('base64'),
      }, (err) => {
        if (err) {
          appLogger.info('RedisKmsStoreDecorator: Failed to store session data. Error : ', err.message);
          appLogger.debug('RedisKmsStoreDecorator: Failed to store session data', {
            err_message: err.message,
            err_stack: err.stack,
          });
        }
        callback(err);
      });
    }).catch((err) => {
      callback(err);
    });
  };
};

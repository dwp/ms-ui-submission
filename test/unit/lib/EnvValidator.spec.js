const assert = require('assert');
const { expect } = require('chai');
const validator = require('../../../app/lib/EnvValidator');

let testEnv;

describe('EnvValidator', () => {
  beforeEach(() => {
    testEnv = {
      DEBUG: '',
      LOG_LEVEL: 'debug',
      SERVER_PORT: '3000',
      SERVER_SSL_ENABLED: 'false',
      SERVER_SSL_KEYFILE: '/test.key',
      SERVER_SSL_CERTFILE: '/test.pem',
      SERVER_SSL_CACERTFILE: '/test.pem',
      SESSIONS_DIR: './sessions/',
      SESSIONS_SECRET: 'mysecret',
      SESSIONS_TTL: '3600',
      REDIS_PORT: '',
      REDIS_HOST: '',
      ESA_CONTROLLER_URL: 'http://test:8000/v1/',
      NOTIFICATION_API_URL: 'http://test:8000/v1/',
      NOTIFY_EMAILTO: 'test@test.co.uk',
      NOTIFY_APIKEY: 'apikey',
      NOTIFY_PROXY: 'test',
    };
  });

  it('should accept a valid minimal configuration', () => {
    expect(() => validator(testEnv)).not.to.throw();
  });

  it('should accept a valid extended configuration', () => {
    testEnv.SERVER_SSL_ENABLED = 'true';
    testEnv.REDIS_PORT = '1234';
    testEnv.REDIS_HOST = 'test';
    testEnv.REDIS_KMS_ID = 'alias/key_ref';
    testEnv.REDIS_AWS_REGION = 'eu-west-2';
    expect(() => validator(testEnv)).not.to.throw();
  });

  describe('Strings', () => {
    it('should not throw and error when DEBUG is missing', () => {
      delete testEnv.DEBUG;
      expect(() => validator(testEnv)).not.to.throw();
    });
    it('should throw an error when required SESSIONS_DIR is missing', () => {
      delete testEnv.SESSIONS_DIR;
      expect(() => validator(testEnv)).to.throw(Error, 'SESSIONS_DIR is missing');
    });
    it('should throw an error when SESSIONS_DIR string value is missing', () => {
      testEnv.SESSIONS_DIR = '';
      expect(() => validator(testEnv)).to.throw(Error, 'SESSIONS_DIR is missing');
    });
    it('should throw an error when SESSIONS_DIR is not string', () => {
      testEnv.SESSIONS_DIR = 123;
      expect(() => validator(testEnv)).to.throw(Error, 'SESSIONS_DIR must be a string');
    });
    it('should throw an error when DEBUG value is not string', () => {
      testEnv.DEBUG = 123;
      expect(() => validator(testEnv)).to.throw(Error, 'DEBUG must be a string');
    });

    it('should not throw an error when DEBUG value is null', () => {
      testEnv.DEBUG = null;
      expect(() => validator(testEnv)).not.to.throw();
    });

    it('should not throw an error when DEBUG value is undefined', () => {
      delete testEnv.DEBUG;
      expect(() => validator(testEnv)).not.to.throw();
    });

    it('should not throw an error when DEBUG value is string', () => {
      testEnv.DEBUG = 'casa';
      expect(() => validator(testEnv)).not.to.throw();
    });
  });

  describe('Booleans', () => {
    it('should default to assigning missing boolean values to false', () => {
      delete testEnv.SERVER_SSL_ENABLED;
      validator(testEnv);
      assert.equal(testEnv.SERVER_SSL_ENABLED, false);
    });

    it('should default to assigning non boolean values to false', () => {
      testEnv.SERVER_SSL_ENABLED = 'test';
      validator(testEnv);
      assert.equal(testEnv.SERVER_SSL_ENABLED, false);
    });
  });

  describe('Integers', () => {
    it('should throw an error when required int vars are missing', () => {
      delete testEnv.SERVER_PORT;
      expect(() => validator(testEnv)).to.throw(Error, 'SERVER_PORT is missing');
    });

    it('should throw an error when required int values are incorrect', () => {
      testEnv.SERVER_PORT = -1;
      expect(() => validator(testEnv)).to.throw(Error, 'SERVER_PORT must be a positive integer');
    });
  });
});

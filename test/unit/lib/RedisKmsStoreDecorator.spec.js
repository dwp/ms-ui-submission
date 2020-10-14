const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(chaiAsPromised);
chai.use(sinonChai);

const RedisKmsStoreDecorator = require('../../../app/lib/RedisKmsStoreDecorator');

describe('RedisKmsStoreDecorator', () => {
  let FakeRedisStoreClass;

  beforeEach(() => {
    FakeRedisStoreClass = function () {}; // eslint-disable-line func-names
    FakeRedisStoreClass.prototype.get = sinon.stub();
    FakeRedisStoreClass.prototype.set = sinon.stub();
  });

  it('should modify the get and set prototype methods', () => {
    const currentGet = FakeRedisStoreClass.prototype.get;
    const currentSet = FakeRedisStoreClass.prototype.set;
    RedisKmsStoreDecorator(FakeRedisStoreClass, null);
    expect(FakeRedisStoreClass.prototype.get).to.not.equal(currentGet);
    expect(FakeRedisStoreClass.prototype.set).to.not.equal(currentSet);
  });

  /* ------------------------------------------------------------------ get() */

  describe('get()', () => {
    it('should call the original get function', () => {
      const originalGet = FakeRedisStoreClass.prototype.get;
      RedisKmsStoreDecorator(FakeRedisStoreClass, null);
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', () => {});
      expect(originalGet).to.have.been.calledWith('SID');
    });

    it('should call callback transparently if data from Redis is not an object', (done) => {
      FakeRedisStoreClass.prototype.get = (sid, callback) => {
        callback(null, 'NON_OBJECT_DATA');
      };
      RedisKmsStoreDecorator(FakeRedisStoreClass, null);
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', (err, data) => {
        expect(err).to.be.null; // eslint-disable-line
        expect(data).to.equal('NON_OBJECT_DATA');
        done();
      });
    });

    it('should call callback transparently if data from Redis is not a valid crypto object', (done) => {
      FakeRedisStoreClass.prototype.get = (sid, callback) => {
        callback(null, {
          invalid_attr: 0,
        });
      };
      RedisKmsStoreDecorator(FakeRedisStoreClass, null);
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', (err, data) => {
        expect(err).to.be.null; // eslint-disable-line
        expect(data).to.eql({ invalid_attr: 0 });
        done();
      });
    });

    it('should pass data through decryption and callback with data if Redis data is a valid crypto object', (done) => {
      const testCipherText = Buffer.from('TEST_CIPHER_TEXT').toString('base64');
      const testCipherKey = Buffer.from('TEST_CIPHER_KEY').toString('base64');

      FakeRedisStoreClass.prototype.get = (sid, callback) => {
        callback(null, {
          ciphertext: testCipherText,
          cipherkey: testCipherKey,
        });
      };
      const stubDecrypt = sinon.stub().resolves(JSON.stringify({
        testData: true,
      }));

      RedisKmsStoreDecorator(FakeRedisStoreClass, {
        decrypt: stubDecrypt,
      });
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', (err, data) => {
        try {
          expect(err).to.be.null; // eslint-disable-line
          expect(stubDecrypt).to.have.been.calledWith({
            ciphertext: Buffer.from(testCipherText, 'base64'),
            cipherkey: Buffer.from(testCipherKey, 'base64'),
          });
          expect(data).to.eql({ testData: true });
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });

    it('should pass data through decryption and callback with error if decryption fails', (done) => {
      FakeRedisStoreClass.prototype.get = (sid, callback) => {
        callback(null, {
          ciphertext: 'CIPHER_TEXT',
          cipherkey: 'CIPHER_KEY',
        });
      };
      const rejectError = new Error('TEST_ERROR');
      const stubDecrypt = sinon.stub().rejects(rejectError);

      RedisKmsStoreDecorator(FakeRedisStoreClass, {
        decrypt: stubDecrypt,
      });
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', (err) => {
        try {
          expect(err).to.equal(rejectError);
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });

    it('should callback with an error if the session data cannot be JSON parsed', (done) => {
      FakeRedisStoreClass.prototype.get = (sid, callback) => {
        callback(null, {
          ciphertext: 'CIPHER_TEXT',
          cipherkey: 'CIPHER_KEY',
        });
      };
      const stubDecrypt = sinon.stub().resolves('cannot parse this');

      RedisKmsStoreDecorator(FakeRedisStoreClass, {
        decrypt: stubDecrypt,
      });
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.get('SID', (err) => {
        try {
          expect(err).to.be.an.instanceof(SyntaxError);
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });
  });

  /* ------------------------------------------------------------------ set() */

  describe('set()', () => {
    it('should callback with an error if encryption fails', (done) => {
      const rejectError = new Error('TEST_ERROR');
      const stubEncrypt = sinon.stub().rejects(rejectError);

      RedisKmsStoreDecorator(FakeRedisStoreClass, {
        encrypt: stubEncrypt,
      });
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.set('SID', 'DATA', (err) => {
        try {
          expect(err).to.equal(rejectError);
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });

    it('should call original set method and pass encrypted data into it', (done) => {
      const testCipherText = Buffer.from('test_ciphertext');
      const testCipherKey = Buffer.from('test_cipherkey');
      const stubEncrypt = sinon.stub().resolves({
        ciphertext: testCipherText,
        cipherkey: testCipherKey,
      });
      FakeRedisStoreClass.prototype.set = (sid, data, callback) => {
        callback();
      };
      const spyOriginalSet = sinon.spy(FakeRedisStoreClass.prototype, 'set');

      RedisKmsStoreDecorator(FakeRedisStoreClass, {
        encrypt: stubEncrypt,
      });
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.set('SID', { data: 0 }, () => {
        try {
          expect(spyOriginalSet).to.have.been.calledWith('SID', {
            cookie: {},
            ciphertext: testCipherText.toString('base64'),
            cipherkey: testCipherKey.toString('base64'),
          });
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });

    it('should callback with an error if the data cannot be JSON stringified', (done) => {
      // Circular references in an object will throw a stringify TypeError
      const obj = {};
      obj.a = obj;
      const unstringifiableData = obj;

      RedisKmsStoreDecorator(FakeRedisStoreClass, null);
      const storeInstance = new FakeRedisStoreClass();
      storeInstance.set('SID', unstringifiableData, (err) => {
        try {
          expect(err).to.be.an.instanceof(TypeError);
          done();
        } catch (ex) {
          done(ex);
        }
      });
    });
  });
});

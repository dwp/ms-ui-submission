import CryptoService from '@dwp/dwp-cryptoservice';
import KmsKeyProvider from '@dwp/dwp-cryptoservice/KmsKeyProvider.js';

const encryptMessageBody = async (body, config) => {
  const providerOptions = {
    cmkId: config.ENC_KEY_ALIAS,
    region: config.SQS_AWS_REGION,
    endpointUrl: config.KMS_ENDPOINT_URL ? config.KMS_ENDPOINT_URL : null,
  };

  const provider = new KmsKeyProvider(providerOptions);
  const crypto = new CryptoService(provider);

  // Encrypt body and set on event
  const cipherObject = await crypto.encrypt(Buffer.from(JSON.stringify(body)));
  return {
    cipherkey: cipherObject.cipherkey.toString('base64'),
    ciphertext: cipherObject.ciphertext.toString('base64'),
  };
};

export default {
  encryptMessageBody,
};

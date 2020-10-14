const chai = require('chai');
const chaiSubset = require('chai-subset');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const os = require('os');
const appName = require('../../../package.json').name;

chai.use(sinonChai);
chai.use(chaiSubset);

const { expect } = chai;

const Logger = require('../../../app/lib/Logger');

describe('Logger', () => {
  it('should write JSON string to stdout', () => {
    const logger = Logger();
    const spy = sinon.spy(process.stdout, 'write');
    logger.info('test_out');
    const outputString = spy.getCall(0).args[0];
    expect(outputString).to.be.a('string');
    const outputObject = JSON.parse(outputString);
    expect(outputObject).to.containSubset({
      app_name: appName,
      hostname: os.hostname(),
      level: 'info',
      message: 'test_out',
    });
  });
});

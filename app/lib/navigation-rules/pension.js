const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimEndDate = (req) => {
  appLogger.info('Navigation rules: pension');
  genericDataUtils.deleteIfPresent(req, 'pension-inherit', ['pensionInherit']);
};

module.exports = claimEndDate;

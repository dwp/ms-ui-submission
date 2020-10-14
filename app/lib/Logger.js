const { createLogger, transports, config } = require('winston');
const DwpWinstonFormat = require('dwp-winston-format');
const packageInfo = require('../../package.json');

module.exports = (options = {}) => {
  if (Object.prototype.toString.call(options) !== '[object Object]') {
    throw new TypeError('Options must be an object');
  }

  const dwpFormat = DwpWinstonFormat(packageInfo, {
    correlationId: options.correlationId || null,
  });

  return createLogger({
    levels: config.syslog.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: dwpFormat,
    transports: [
      new transports.Console(),
    ],
  });
};

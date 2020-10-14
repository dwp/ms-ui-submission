const Logger = require('../Logger');

const appLogger = Logger();
/**
 * Build the Declaration part of the data structure.
 *
 * @param {function} translator function
 * @return {string} declaration string
 */
module.exports = (translator) => {
  appLogger.info('makeDeclaration');
  return [
    translator.t('declaration:intro'),
    translator.t('declaration:li1'),
    translator.t('declaration:li2'),
    translator.t('declaration:li3'),
    translator.t('declaration:warning'),
    translator.t('declaration:agreeButton'),
  ].join('\n');
};

import Logger from '../logger.js';

const appLogger = Logger();
/**
 * Build the Declaration part of the data structure.
 *
 * @param {Function} translator Function.
 * @returns {string} Declaration string.
 */
export default (translator) => {
  appLogger.info('makeDeclaration');
  return [
    translator('declaration:intro'),
    translator('declaration:li1'),
    translator('declaration:li2'),
    translator('declaration:li3'),
    translator('declaration:warning'),
    translator('declaration:agreeButton'),
  ].join('\n');
};

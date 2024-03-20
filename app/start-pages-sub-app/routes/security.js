import Logger from '../../../src/lib/logger.js';

const appLogger = Logger();

export default (router) => {
  router.get('/.well-known/security.txt', (req, res) => {
    appLogger.info(`${req.method}: /.well-known/security.txt`);
    res.sendFile('security.txt', { root: '.' });
  });
};

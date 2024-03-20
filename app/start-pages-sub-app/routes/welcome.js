import Logger from '../../../src/lib/logger.js';

const appLogger = Logger();

export default (router) => {
  router.get('/welcome', (req, res) => {
    appLogger.info(`${req.method}: /welcome`);
    res.redirect('/who-is-applying');
  });
};

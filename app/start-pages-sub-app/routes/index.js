import Logger from '../../../src/lib/logger.js';

const appLogger = Logger();

export default (router) => {
  router.get('/', (req, res) => {
    if (req.query.lang === 'cy') {
      appLogger.info(`${req.method}: /`);
      res.redirect('/who-is-applying?lang=cy');
    } else {
      appLogger.info(`${req.method}: /`);
      res.redirect('/who-is-applying');
    }
  });
};

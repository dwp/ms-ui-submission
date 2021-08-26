const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/.well-known/security.txt', (req, res) => {
    appLogger.info(`${req.method}: /.well-known/security.txt`);
    res.sendFile('security.txt', { root: '.' });
  });
};

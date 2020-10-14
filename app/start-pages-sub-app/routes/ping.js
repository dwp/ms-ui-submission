const bodyParser = require('body-parser');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/ping', bodyParser.raw({ limit: 0 }), (req, res) => {
    appLogger.debug('ping');
    res.status(204).send();
  });
};

/**
 * Set a unique application ref for the current session, when the user starts
 * their application for the first time. This ref will be stored in the session
 * and also made available to templates via `res.locals.applicationRef`
 */
/* eslint-disable */
const Hashids = require('hashids/cjs');
const Logger = require('../lib/Logger');

const hashids = new Hashids('ESA', 6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');

module.exports = (router, redis, startPage) => {
  router.all(`/${startPage}`, (req, res, next) => { // eslint-disable-line consistent-return
    const appLogger = req.logger || Logger();

    if (typeof req.session.applicationRef !== 'undefined') {
      return next();
    }

    function setAppRef(ref) {
      req.session.applicationRef = ref;
      req.session.save(() => {
        appLogger.info('Generated new application ref %s', req.session.applicationRef);
        next();
      })
    }

    let ref;
    if (typeof redis !== 'undefined') {
      redis.incr('esa:ref').then((int) => {
        ref = hashids.encode(int);
        setAppRef(ref);
      }).catch((e) => {
        appLogger.error('Error incrementing esa:ref key in Redis', {
          err_message: e.message,
          err_stack: e.stack,
        });
        return res.status(503).render('casa/errors/503.njk');
      });
    } else {
      // Spoof a ref for local development where redis isn't available
      appLogger.info('Spoofing ref for local development where redis is not available');
      ref = req.session.id
        .replace(/[^a-z0-9]/ig, '')
        .substring(0, 5)
        .toUpperCase();
      setAppRef(ref);
    }
  });
};

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Logger from '../lib/logger.js';

const appLogger = Logger();

const __dirname = dirname(fileURLToPath(import.meta.url));

export default () => {
  const configure = (config) => {
    // Add a views directory
    config.views.push(resolve(__dirname, 'views'));
  };
  const bootstrap = ({ ancillaryRouter, cookieParserMiddleware }) => {

    ancillaryRouter.prependUse(cookieParserMiddleware, (req, res, next) => {
      appLogger.info('running session timeout helper');
      let sessionTimeout = 0;
      let sessionExpiry = false;
      if (req.session && req.session.dateExpire) {
        sessionExpiry = req.session.dateExpire;
      }
      if (process.env && process.env.SESSIONS_TTL) {
        sessionTimeout = Math.round(process.env.SESSIONS_TTL / 60);
      }
      if (res.locals) {
        res.locals.timeout = {
          packageVersion: process.env.npm_package_version || '1',
          sessionTimeout,
          sessionExpiry,
          refreshDestination: req.url || '/',
          startPageAfterTimeout: 'eligibility-start',
        };
      }
      next();
    });
  };
  return {
    configure,
    bootstrap,
  };
};

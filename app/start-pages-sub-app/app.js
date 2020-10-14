const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const I18n = require('../../node_modules/@dwp/govuk-casa/lib/I18n');

const locales = ['en', 'cy'];
const I18nUtility = I18n([path.resolve(__dirname, '../locales')], locales);
const Logger = require('../lib/Logger');

const appLogger = Logger();
const app = express();
appLogger.debug('Set up nunjucks environment');
const env = nunjucks.configure([
  path.resolve(__dirname, 'views'),
  path.resolve(__dirname, '../views'),
  path.resolve(__dirname, '../../node_modules/@dwp/govuk-casa/views'),
  path.resolve(__dirname, '../../node_modules/@dwp/govuk-casa/views/casa'),
  path.resolve(__dirname, '../../node_modules/govuk-frontend/govuk'),
  path.resolve(__dirname, '../../node_modules/govuk-frontend/govuk/components'),

], {
  autoescape: true,
  express: app,
});

const csp = {
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'sha256-P8kY3SA5xRdEft8gjfb/t1FP6Nmd892V2PRx7lGETfE='",
    "'sha256-DE9Q8ymiovhm19g8P/nbMMre7j2sel59tMCnbxlSUuE='",
    'https://www.google-analytics.com/',
    'https://tagmanager.google.com/',
    'https://www.googletagmanager.com/',
  ],
};

app.set('view engine', 'njk');

require('../../node_modules/@dwp/govuk-casa/middleware/headers')(app, csp);
require('../../node_modules/@dwp/govuk-casa/middleware/i18n')(app, locales, I18nUtility);

app.use((req, res, next) => {
  // set up casa things...
  res.locals = {
    casaMountUrl: '/',
    phase: 'beta',
    govuk: {
      assetPath: '/govuk/frontend/assets',
      components: {
        header: {
          assetsPath: '/govuk/frontend/assets/images',
          serviceName: req.i18nTranslator.t('app:serviceName'),
          serviceUrl: '/',
          homepageUrl: 'https://www.gov.uk/',
        },
      },
    },
    ...res.locals,
  };
  next();
});

require('./routes/ping')(app);
require('./routes/index')(app);
require('./routes/before-you-start')(app);
require('./routes/welcome')(app);

module.exports = app;

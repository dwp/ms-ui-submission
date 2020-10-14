const casa = require('@dwp/govuk-casa');
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const FileStore = require('session-file-store')(expressSession);
const fs = require('fs');
const https = require('https');
const gulp = require('gulp');
require('../gulpfile');
const RedisStore = require('connect-redis')(expressSession);
const Redis = require('ioredis');
const CryptoService = require('dwp-cryptoservice');
const KmsKeyProvider = require('dwp-cryptoservice/KmsKeyProvider');
const RedisKmsStoreDecorator = require('./lib/RedisKmsStoreDecorator');
const Logger = require('./lib/Logger');
const envValidator = require('./lib/EnvValidator');
const SubmissionService = require('./lib/SubmissionService');
const NotificationService = require('./lib/NotificationService');
const journey = require('./definitions/journey');
const cookieMiddleware = require('./middleware/cookie-message');
const mediaMiddleware = require('./middleware/media.js');

const consentCookieName = 'SeenCookieMessage';
const cookiePolicy = 'cookie-policy';
const cookieConsent = 'cookie-consent';
const cookieDetails = 'cookie-details';

const appLogger = Logger();
const casaSubApp = express();
const startSubApp = require('./start-pages-sub-app/app');

// create the minified js.
gulp.task('minifyjs')();

const app = express();

let appConfig = { ...process.env };

try {
  appConfig = envValidator(appConfig);
} catch (e) {
  if (!e.message.includes('LOG_LEVEL')) {
    appLogger.crit('Environment is misconfigured', {
      err_message: e.message,
      err_stack: e.stack,
    });
  } else {
    throw e;
  }
  process.exit(1);
}

// Hide the app pages from search engine indexes.
// Either remove this code or set the ROBOT_INDEX env var to true
// to remove the Robots Tag header.
if (process.env.ROBOT_INDEX !== 'true') {
  appLogger.info('Add X-Robots-Tag with noindex, nofollow');
  app.use((req, res, next) => {
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
  });
}

app.use(startSubApp);
app.use(casaSubApp);

casaSubApp.use('/govuk/esa', express.static(path.join(__dirname, 'static/esa')));

if (appConfig.NOTIFY_PROXY === 'null') {
  appConfig.NOTIFY_PROXY = null;
}
// Create an instance of the submission service
appLogger.info('Set up SubmissionService client');
const submissionService = new SubmissionService(
  appConfig.ESA_CONTROLLER_URL,
  appConfig.API_KEY,
);

// Create an instance of the notification service
appLogger.info('Set up Notification Service');
const notificationService = new NotificationService(
  appConfig.NOTIFICATION_API_URL,
);
// Prepare the KMS crypto for encrypting session data
appLogger.info('Set up KMS crypto service client');
const kmsKeyProvider = new KmsKeyProvider({
  cmkId: appConfig.REDIS_KMS_ID,
  keySpec: 'AES_256',
  region: appConfig.REDIS_AWS_REGION,
  endpointUrl: appConfig.KMS_ENDPOINT_URL ? appConfig.KMS_ENDPOINT_URL : null,
});
const cryptoService = new CryptoService(kmsKeyProvider);

// Prepare a session store
let sessionStore;
let redisClient;
if (appConfig.REDIS_PORT && appConfig.REDIS_HOST) {
  appLogger.info(
    'Using Redis session store on %s:%s',
    appConfig.REDIS_HOST,
    appConfig.REDIS_PORT,
  );
  redisClient = new Redis.Cluster([{
    host: appConfig.REDIS_HOST,
    port: appConfig.REDIS_PORT,
  }], {
    redisOptions: {
      db: 0,
    },
  });

  let retryCount = 0;
  const REDIS_MAX_RETRY = 20;
  redisClient.on('error', (e) => {
    appLogger.error('Redis error; will retry connection', {
      retry_counter: retryCount,
      err_message: e.message,
      err_stack: e.stack,
    });
    retryCount++; // eslint-disable-line
    if (retryCount > REDIS_MAX_RETRY) {
      appLogger.crit('Redis could not recover from error; exiting', {
        err_message: e.message,
        err_stack: e.stack,
      });
      process.exit(1);
    }
  });

  // Decorate the session store with KMS-enabled getters/setters
  appLogger.info('Setup KMS crypto on Redis session store client');
  RedisKmsStoreDecorator(RedisStore, cryptoService);

  // Create session store
  sessionStore = new RedisStore({
    client: redisClient,
    secret: appConfig.SESSIONS_SECRET,
    prefix: 'esa:',
    ttl: parseInt(appConfig.SESSIONS_TTL, 10),
    logErrors: (err) => {
      appLogger.error('Redis session error', {
        err_message: err.message,
        err_stack: err.stack,
      });
    },
  });
} else {
  appLogger.info('Using default file-based session store; storing in %s', appConfig.SESSIONS_DIR);
  sessionStore = new FileStore({
    path: appConfig.SESSIONS_DIR,
    // NOTE: MUST match the secret used in `sessions.secret` CASA config
    secret: appConfig.SESSIONS_SECRET,
    // clean up stale session every 30 minutes
    reapInterval: 1800,
  });
}

appLogger.info('Set up CASA application');
const casaApp = casa(casaSubApp, {
  mountUrl: '/',
  views: {
    dirs: [path.resolve(__dirname, 'views'), './node_modules/govuk-frontend/components'],
  },
  compiledAssetsDir: path.resolve(__dirname, 'static'),
  phase: 'beta',
  serviceName: 'app:serviceName',
  sessions: {
    name: 'SESSIONID',
    store: sessionStore,
    secret: appConfig.SESSIONS_SECRET,
    // Idle time before sessions are destroyed (seconds)
    ttl: appConfig.SESSIONS_TTL,
    secure: appConfig.SERVER_SSL_ENABLED,
  },
  i18n: {
    dirs: [path.resolve(__dirname, 'locales')],
    locales: ['en', 'cy'],
  },
  allowPageEdit: true,
  csp: {
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'sha256-P8kY3SA5xRdEft8gjfb/t1FP6Nmd892V2PRx7lGETfE='",
      "'sha256-DE9Q8ymiovhm19g8P/nbMMre7j2sel59tMCnbxlSUuE='",
      "'sha256-8PMdLcrHifoMMuqmO1JrZ/OCYR5pkBEJcDv9tlGGYLY='",
      "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
      'https://www.google-analytics.com/',
      'https://tagmanager.google.com/',
      'https://www.googletagmanager.com/',
    ],
  },
  mountController: function casaMountController(mountCommonMiddleware) {
    mediaMiddleware(this.expressApp, '/', './app/');
    mountCommonMiddleware();
    cookieMiddleware(
      this.expressApp,
      '/',
      '/',
      consentCookieName,
      cookiePolicy,
      cookieConsent,
      appConfig.SERVER_SSL_ENABLED,
    );
  },
});

// Add Google Tag Manger ID to view
casaSubApp.get('nunjucksEnv').addGlobal('googleTagManagerId', appConfig.GOOGLE_TAG_MANAGER_ID);

const startPage = journey.allWaypoints()[0];

require('./middleware/edit')(casaApp.router);
require('./middleware/timeout-helper')(casaApp.router);
require('./middleware/page-path')(casaApp.router);
require('./middleware/application-ref')(casaApp.router, redisClient, startPage);
require('./middleware/journey-logger.js')(casaApp.router);

require('./middleware/navigation-override')(casaApp.router);
casaApp.loadDefinitions(
  require('./definitions/pages'),
  journey,
);

const cookieDetailsGet = require('./routes/cookie-details.get');
const cookiePolicyGet = require('./routes/cookie-policy.get');
const cookiePolicyPost = require('./routes/cookie-policy.post');
require('./routes/check-your-answers')(casaApp.router, casaApp.csrfMiddleware, casaApp.config.mountUrl, journey);
require('./routes/cancel')(casaApp.router, casaApp.csrfMiddleware);
require('./routes/remove')(casaApp.router, casaApp.csrfMiddleware);
require('./routes/declaration')(casaApp.config.mountUrl, casaApp.router, casaApp.csrfMiddleware, submissionService, notificationService);
require('./routes/complete')(casaApp, casaApp.config.mountUrl, casaApp.router);
require('./routes/feedback')(casaApp.router, casaApp.csrfMiddleware, appConfig.NOTIFY_EMAILTO, appConfig.NOTIFY_APIKEY, appConfig.NOTIFY_PROXY, appConfig.NOTIFY_URL ? appConfig.NOTIFY_URL : null);
require('./routes/thankyou')(casaApp.router);
require('./routes/accessibility-statement')(casaApp.router);
require('./routes/eligibility-start')(casaApp.router);
require('./lib/view-filters')(casaSubApp);

// Claim submission handlers
const submissionCommonMw = [casaApp.csrfMiddleware];

// Cookie policy pages
casaApp.router.get(`/${cookieDetails}`, submissionCommonMw, cookieDetailsGet(
  cookiePolicy,
  consentCookieName,
  'SESSIONID',
  appConfig.SESSIONS_TTL,
));
casaApp.router.get(`/${cookiePolicy}`, submissionCommonMw, cookiePolicyGet(cookieDetails));
casaApp.router.post(`/${cookiePolicy}`, submissionCommonMw, cookiePolicyPost(consentCookieName, appConfig.SERVER_SSL_ENABLED));

// Setup SSL
let httpsServer;
if (appConfig.SERVER_SSL_ENABLED) {
  httpsServer = https.createServer({
    key: fs.readFileSync(appConfig.SERVER_SSL_KEYFILE),
    cert: fs.readFileSync(appConfig.SERVER_SSL_CERTFILE),
    ca: fs.readFileSync(appConfig.SERVER_SSL_CACERTFILE),
  }, app);
}
// Start server
const server = (appConfig.SERVER_SSL_ENABLED ? httpsServer : app)
  .listen(appConfig.SERVER_PORT, () => {
    const { address, port } = server.address();
    const urlProtocol = appConfig.SERVER_SSL_ENABLED ? 'https' : 'http';
    appLogger.info(`App listening at ${urlProtocol}://%s:%s`, address, port);
  });

// Ensure all inactive connections are terminated by the ALB,
// by setting this a few seconds higher than the ALB idle timeout
server.keepAliveTimeout = 65000;

// Ensure the headersTimeout is set higher than the
// keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
server.headersTimeout = 66000;

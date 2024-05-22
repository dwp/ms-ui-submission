import express from 'express';
import expressSession from 'express-session';

import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import '../gulpfile.js';

import cRedis from 'connect-redis';
import { Cluster } from 'ioredis';
import sessionFileStore from 'session-file-store';

import CryptoService from '@dwp/dwp-cryptoservice';
import KmsKeyProvider from '@dwp/dwp-cryptoservice/lib/KmsKeyProvider.js';
import { configure } from '../src/casa.js';
import envValidator from '../src/lib/EnvValidator.js';
import RedisKmsStoreDecorator from '../src/lib/RedisKmsStoreDecorator.js';

import SubmissionService from '../src/lib/SubmissionService.js';
import notificationService from './services/NotificationService.js';

import eventsFactory from './definitions/events.js';
import pages from './definitions/pages.js';
import planFactory from './definitions/plan.js';

import middlewareEdit from '../src/middleware/edit.js';
import middlewarePagePath from '../src/middleware/page-path.js';
import middlewareAppRef from '../src/middleware/application-ref.js';
import middlewareJourneyLog from '../src/middleware/journey-logger.js';
import middlewareBackOverride from '../src/middleware/navigation-override/index.js';

import checkYourAnswersPlugin from './plugins/check-your-answers/plugin.js';
import cookieConsentPlugin from './plugins/cookie-consent/plugin.js';
import middlewarePlugin from '../src/middleware/timeout-helper.js';
import cookieDetailsGet from '../src/routes/cookie-details.get.js';
import cookiePolicyGet from '../src/routes/cookie-policy.get.js';
import cookiePolicyPost from '../src/routes/cookie-policy.post.js';

import checkYourAnswers from '../src/routes/check-your-answers.js';
import cancel from '../src/routes/cancel.js';
import remove from '../src/routes/remove.js';
import declaration from '../src/routes/declaration.js';
import complete from '../src/routes/complete.js';
import feedback from '../src/routes/feedback.js';
import thankyou from '../src/routes/thankyou.js';
import accessibilitySt from '../src/routes/accessibility-statement.js';
import telephoneApp from '../src/routes/telephone-application.js';
import ping from './start-pages-sub-app/routes/ping.js';
import index from './start-pages-sub-app/routes/index.js';
import security from './start-pages-sub-app/routes/security.js';

import viewFilters from './view-filters/view-filters.js';

import Logger from '../src/lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RedisStore = cRedis(expressSession);

const FileStore = sessionFileStore(expressSession);
const { processNotifications } = notificationService;

import welcome from "./start-pages-sub-app/routes/welcome.js";

const { static: expressStatic } = express; // CommonJS

const consentCookieName = 'SeenCookieMessage';
const cookiePolicy = 'cookie-policy';
const cookieDetails = 'cookie-details';

const appLogger = Logger();

// create the minified js.
// task('minifyjs')(); // NEEDS FIXING

let appConfig = { ...process.env };

try {
  appConfig = envValidator(appConfig);
} catch (e) {
  if (!e.message.includes('LOG_LEVEL')) {
    appLogger.fatal('Environment is misconfigured', {
      err_message: e.message,
      err_stack: e.stack,
    });
  } else {
    throw e;
  }
  process.exit(1);
}

if (appConfig.NOTIFY_PROXY === 'null') {
  appConfig.NOTIFY_PROXY = null;
}
// Create an instance of the submission service
appLogger.info('Set up SubmissionService client');
const submissionService = new SubmissionService(
  appConfig.ESA_CONTROLLER_URL,
  appConfig.API_KEY,
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
  let clusterOptions = {
    redisOptions: { db: 0 },
  };
  // Check whether redis is using transit encryption and amend clusterOptions if so
  if (appConfig.REDIS_ENCRYPTION_TRANSIT) {
    clusterOptions = {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: { db: 0, tls: {} },
    };
  }
  redisClient = new Cluster([{
    host: appConfig.REDIS_HOST,
    port: appConfig.REDIS_PORT,
  }], clusterOptions);

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
      appLogger.fatal('Redis could not recover from error; exiting', {
        err_message: e.message,
        err_stack: e.stack,
      });
      process.exit(1);
    }
  });
  redisClient.on('ready', () => {
    appLogger.info('Redis connection ready');
  });
  redisClient.on('reconnecting', () => {
    appLogger.info('Redis reconnecting');
  });
  redisClient.on('end', () => {
    appLogger.info('Redis connection ended');
  });
  redisClient.on('connect', () => {
    appLogger.info('Redis connection established');
  });
  redisClient.on('warning', (e) => {
    appLogger.warn('Redis warning: %s', e);
  });
  redisClient.on('close', () => {
    appLogger.info('Redis connection closed');
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

const views = [resolve(__dirname, 'views'), './node_modules/govuk-frontend/components'];
const session = {
  name: 'SESSIONID',
  secret: appConfig.SESSIONS_SECRET,
  ttl: appConfig.SESSIONS_TTL, // Idle time before sessions are destroyed (seconds)
  secure: appConfig.SERVER_SSL_ENABLED,
  store: sessionStore,
};

appLogger.info('Set up CASA application');
const application = ({
  MOUNT_URL = '/',
}) => {
  const plan = planFactory();
  const events = eventsFactory(plan);

  // Configure some CASA routes and other middleware for use in our CASA app
  const {
    staticRouter, ancillaryRouter, csrfMiddleware, mount, nunjucksEnv,
  } = configure({
    views,
    phase: 'beta',
    serviceName: 'app:serviceName',
    session,
    hooks: [{
      hook: 'journey.postvalidate',
      middleware: (req, res, next) => {
        const errors = req.casa.journeyContext.getValidationErrorsForPage(req.casa.waypoint);
        if (errors.length) appLogger.warn(`Running "journey.postvalidate" hook on "${req.path}". There were ${errors.length} validation errors`);
        next();
      },
    }],
    i18n: {
      dirs: [resolve(__dirname, 'locales')],
      locales: ['en', 'cy'],
    },
    pages: pages(),
    plan,
    events,
    plugins: [
      middlewarePlugin(),
      cookieConsentPlugin(
        '/',
        '/',
        consentCookieName,
        cookiePolicy,
        appConfig.SERVER_SSL_ENABLED,
      ),
      checkYourAnswersPlugin({
        waypoints: ['check-your-answers'],
      }),
    ],
    helmetConfigurator: (config) => {
      if (!appConfig.SERVER_SSL_ENABLED) {
        appLogger.info('running on http');
        config.contentSecurityPolicy.directives.upgradeInsecureRequests = null;
      }
      config.contentSecurityPolicy.directives['script-src'] = [
        ...config.contentSecurityPolicy.directives['script-src'],
        '\'unsafe-inline\'',
      ].filter((directive) => !(directive instanceof Function) || directive.name !== 'casaCspNonce');
      return config;
    },
  });

  staticRouter.use('/assets', expressStatic(resolve(__dirname, 'assets/')));
  staticRouter.all('/assets', (req, res) => res.status(404).send('Not found'));

  // Mount everything in an ExpressJS app
  const casaApp = express();
  const app = express();

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

  app.use(expressSession({
    ...session,
    resave: true,
    saveUninitialized: true,
  }));

  nunjucksEnv.addGlobal('googleTagManagerId', appConfig.GOOGLE_TAG_MANAGER_ID);

  const staticMiddleware = express.static(join(__dirname, 'static/esa'));
  casaApp.use('/govuk/esa', staticMiddleware);

  middlewareEdit(casaApp);
  middlewareBackOverride(ancillaryRouter);
  middlewarePagePath(casaApp);

  const startPage = plan.getWaypoints()[0];
  middlewareAppRef(ancillaryRouter, redisClient, `/${startPage}`);

  middlewareJourneyLog(casaApp);

  checkYourAnswers(ancillaryRouter, csrfMiddleware, MOUNT_URL, plan);
  cancel(ancillaryRouter, csrfMiddleware);
  remove(ancillaryRouter, csrfMiddleware);
  declaration(casaApp, MOUNT_URL, ancillaryRouter, csrfMiddleware, submissionService, processNotifications, appConfig);
  complete(casaApp, MOUNT_URL, ancillaryRouter);
  feedback(ancillaryRouter, csrfMiddleware, appConfig.NOTIFY_EMAILTO, appConfig.NOTIFY_APIKEY, appConfig.NOTIFY_PROXY, appConfig.NOTIFY_URL ? appConfig.NOTIFY_URL : null);
  thankyou(ancillaryRouter);
  accessibilitySt(ancillaryRouter);
  telephoneApp(ancillaryRouter);
  viewFilters(nunjucksEnv, casaApp);
  welcome(ancillaryRouter);
  index(ancillaryRouter);
  security(ancillaryRouter);
  app.use(MOUNT_URL, ping(casaApp));

  // Example of how to mount a handler for the `/` index route. Need to use a
  // regex for the specific match to only `/`.
  ancillaryRouter.use(/^\/$/, (req, res) => {
    res.redirect(302, `${req.baseUrl}/who-is-applying`);
  });

  ancillaryRouter.get(`/${cookiePolicy}`, csrfMiddleware, cookiePolicyGet(cookieDetails));
  ancillaryRouter.post(`/${cookiePolicy}`, csrfMiddleware, cookiePolicyPost(consentCookieName, appConfig.SERVER_SSL_ENABLED));
  ancillaryRouter.get(`/${cookieDetails}`, csrfMiddleware, cookieDetailsGet(
    cookiePolicy,
    consentCookieName,
    'SESSIONID',
    appConfig.SESSIONS_TTL,
  ));

  // Mount the CASA app on a parent ExpressJS app
  mount(casaApp);

  app.use(MOUNT_URL, casaApp);

  return app;
};

export default application;

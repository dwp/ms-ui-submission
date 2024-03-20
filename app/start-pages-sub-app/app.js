import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { configure } from '../../src/casa.js';
import pages from '../definitions/pages.js';
import planFactory from '../definitions/plan.js';
import headers from '../../src/middleware/headers.js';
import ping from '../start-pages-sub-app/routes/ping.js';
import index from '../start-pages-sub-app/routes/index.js';
import welcome from '../start-pages-sub-app/routes/welcome.js';
import security from '../start-pages-sub-app/routes/security.js';
import Logger from '../../src/lib/logger.js';

const appLogger = Logger();
const __dirname = dirname(fileURLToPath(import.meta.url));

appLogger.info('Loading start-pages-sub-app')

const i18n = {
    i18n: {
        dirs: [resolve(__dirname, 'locales')],
        locales: ['en', 'cy'],
        defaultLocale: 'en',
    },
};

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

const views = [resolve(__dirname, 'views'), './node_modules/govuk-frontend/components'];

const application = ({
    session,
}) => {
    // Configure CASA app
    const { mount } = configure({
        views,
        phase: 'beta',
        serviceName: 'app:serviceName',
        session,
        pages: pages(),
        plan: planFactory(),
        i18n,
    });

    // Mount and return the app
    const casaApp = express();
    casaApp.set('view engine', 'njk');
    return mount(casaApp, {
        route: '/:contextid',
    });
};

const app = express();
const router = express.Router();
headers(app, csp);

ping(router);
index(router);
welcome(router);
security(router);

export default application;
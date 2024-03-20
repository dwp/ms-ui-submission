import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { stringify } from 'querystring';
import setConsentCookie from '../../utils/set-consent-cookie.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function setCookieAndRedirect(res, req, consentCookieName, cookie, useTLS, sanitiseUrl) {
  setConsentCookie(req, res, consentCookieName, cookie, useTLS);

  req.session.save(() => {
    const referrer = req.get('Referrer');

    if (referrer && !/^javascript:/.test(referrer)) {
      const { pathname, search } = new URL(referrer, 'http://nsesa.gov.uk/');
      const redirectBackTo = sanitiseUrl(pathname + search);
      res.redirect(redirectBackTo);
    } else {
      res.redirect('/');
    }
  });
}

export default (mountUrl, proxyMountUrl, consentCookieName, cookiePolicy, useTLS) => {
  const configure = (config) => {
    // Add a views directory
    config.views.push(resolve(__dirname, 'views'));
  };
  const reProxyMountUrl = new RegExp(`^${proxyMountUrl}`);
  const sanitiseUrl = (url) => url.replace(reProxyMountUrl, mountUrl).replace(/\/+/g, '/');
  const cookiePolicyUrl = `${mountUrl}${cookiePolicy}`;

  const bootstrap = ({ nunjucksEnv, ancillaryRouter, cookieParserMiddleware }) => {
    // Add a new general info page
    ancillaryRouter.get('/cookie-consent/info', (req, res) => {
      res.render('cookie-consent/info.njk');
    });

    // Make the cookie choice available to all templates, on all pages, so that
    // the cookie-banner template can use it to show/hide itself.
    // This is _prepended_ to ensure it has the best chance of appearing before
    // any template rendering middleware.
    ancillaryRouter.prependUse(cookieParserMiddleware, (req, res, next) => {
      if (req.cookies) {
        res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
        req.session.cookieChoiceMade = undefined;
      }

      // Add current consent cookie value to templates
      if (req.cookies[consentCookieName]) {
        res.locals.cookieMessage = req.cookies[consentCookieName];
      } else {
          res.locals.cookieMessage = 'unset';
      }
      // res.locals.cookieConsentChoice = req.cookies.cookie_consent ? String(req.cookies.cookie_consent) : undefined;
      // Set backto query
      const { pathname, search } = new URL(String(req.originalUrl), 'http://nsesa.gov.uk/');
      const currentUrl = sanitiseUrl(pathname + search);

      // If already on cookie policy page, don't need set backto again
      if (pathname === cookiePolicyUrl) {
        res.locals.cookiePolicyUrl = currentUrl;
        res.locals.backLink = currentUrl.replace('/cookie-policy', '');
      } else {
        res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${stringify({ backto: currentUrl })}`;
      }

      // Set referrer policy
      res.set('Referrer-Policy', 'same-origin');
      next();
    });

    // Handle response from cookie banner
    // We can't use `csrfMiddleware` here because we can't insert a csrf token
    // into the banner form. We don't know what pages this banner will be shown
    // on, and as such can't guarantee that the session middleware is present
    // on all routes.
    ancillaryRouter.post('/cookie-consent/accept', cookieParserMiddleware, (req, res) => {
      // res.cookie('cookie_consent', 'accept');
      setCookieAndRedirect(res, req, consentCookieName, 'accept', useTLS, sanitiseUrl);
    });
    ancillaryRouter.post('/cookie-consent/reject', cookieParserMiddleware, (req, res) => {
      setCookieAndRedirect(res, req, consentCookieName, 'reject', useTLS, sanitiseUrl);
    });

    // Inject gtm script into the `head` block
    nunjucksEnv.modifyBlock('head', () => '{% if cookieMessage === "accept" %}{% include "cookie-consent/gtm-script.njk" %}{% endif %}');
    //
    // // Inject cookie banner template into the `bodyStart` block
    nunjucksEnv.modifyBlock('bodyStart', () => '{% if cookieMessage === "unset" or cookieChoiceMade %}{% include "cookie-consent/banner.njk" %}{% endif %}');
    //
    // // If cookies are accepted, we can inject some extra javascript
    nunjucksEnv.modifyBlock('bodyStart', () => '{% if cookieMessage === "accept" %}{% include "cookie-consent/gtm-noscript.njk" %}{% endif %}');
  };

  return {
    configure,
    bootstrap,
  };
};

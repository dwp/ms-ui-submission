const qs = require('querystring');
const cookieParser = require('cookie-parser');
const setConsentCookie = require('../utils/set-consent-cookie.js');

// eslint-disable-next-line max-len
module.exports = (app, mountUrl, proxyMountUrl, consentCookieName, cookiePolicy, cookieConsent, useTLS) => {
  const reProxyMountUrl = new RegExp(`^${proxyMountUrl}`);
  const sanitiseUrl = (url) => url.replace(reProxyMountUrl, mountUrl).replace(/\/+/g, '/');

  // URL to cookie policy page
  const cookiePolicyUrl = `${mountUrl}${cookiePolicy}`;
  app.use(cookieParser());

  // Set template options for cookie consent banner
  app.use((req, res, next) => {
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
      req.session.cookieChoiceMade = undefined;
    }

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.cookieMessage = req.cookies[consentCookieName];
    } else {
      res.locals.cookieMessage = 'unset';
    }

    // Url to submit consent to (used in banner)
    res.locals.cookieConsentSubmit = cookieConsent;

    // Set backto query
    const { pathname, search } = new URL(String(req.originalUrl), 'http://nsesa.gov.uk/');
    const currentUrl = sanitiseUrl(pathname + search);

    // If already on cookie policy page, don't need set backto again
    if (pathname === cookiePolicyUrl) {
      res.locals.cookiePolicyUrl = currentUrl;
      res.locals.backLink = currentUrl.replace('/cookie-policy', '');
    } else {
      res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${qs.stringify({ backto: currentUrl })}`;
    }

    // Set referrer policy
    res.set('Referrer-Policy', 'same-origin');

    next();
  });

  // Handle setting consent cookie from banner submisson
  app.post(`${proxyMountUrl}${cookieConsent}/:cookieMethod`, (req, res) => {
    const { cookieMethod } = req.params;

    if (cookieMethod === 'reject' || cookieMethod === 'accept') {
      setConsentCookie(req, res, consentCookieName, cookieMethod, useTLS);
    }

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
  });
};

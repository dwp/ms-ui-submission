const setConsentCookie = require('../utils/set-consent-cookie.js');

module.exports = (consentCookieName, useTLS) => (req, res) => {
  const { cookieConsent } = req.body;

  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';
    return req.session.save(() => res.redirect(req.originalUrl));
  }

  // Validation successful, set cookie and redirect back where they came from
  // via backto query string, if it exists
  setConsentCookie(req, res, consentCookieName, cookieConsent, useTLS);

  if (req.query.backto) {
    const { pathname, search } = new URL(String(req.query.backto), 'http://nsesa.gov.uk/');
    const redirectBackTo = (pathname + search).replace(/\/+/g, '/').replace(/[.:]+/g, '');
    return req.session.save(() => res.redirect(redirectBackTo));
  }

  return req.session.save(() => res.redirect(req.originalUrl));
};

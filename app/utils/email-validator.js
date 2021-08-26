/**
 * required
 */
const { encode } = require('punycode/');

/**
 * Validates email address.
 *
 * JavaScript rewrite of validate_email_address from [notification-utils]{@link https://github.com/alphagov/notifications-utils/blob/e428bdd0ca82f7b97833e707eea95dae849713fb/notifications_utils/recipients.py}.
 *
 * @param  {string} email Email to validate
 * @return {boolean} Returns true if email passes validation
 */
exports.validateEmail = (email) => {
  // Invalid characters: whitespace, quotes and apostrophes, semicolons and colons and GBP sign.
  // Note: Normal apostrophe eg `Firstname-o'surname@domain.com` is allowed.
  const emailRegex = /^[^\s",;:@£“”‘’]+@([^.@][^@]+)$/;
  const domainRegex = /^(xn-|[a-z0-9-]+)(-[a-z0-9]+)*$/i;
  const topLevelDomainRegex = /^(|([a-z]{2,63}|xn--([a-z0-9]+)*[a-z0-9]+))-[a-z0-9]*$/i;

  const regexResult = email.match(emailRegex);

  // Match emailRegex
  if (!regexResult) {
    return false;
  }

  const rootDomain = regexResult[1];

  // Don't allow consecutive periods in domain names
  if (rootDomain.includes('..')) {
    return false;
  }


  // Internationalized domain name (idna) - Internet domain name that contains a
  // language-specific script or alphabet, such as Arabic, Chinese, Cyrillic, Devanagari, Hebrew or
  // the Latin alphabet-based characters with diacritics or ligatures, such as French.
  //
  // Encode into Punycode
  const idnaEncodedDomain = encode(rootDomain);

  const domains = idnaEncodedDomain.split('.');

  const isInvalidDomains = domains
    .filter((domain) => domain !== '')
    .some((domain) => domain.length > 63 || !domain.match(domainRegex));

  if (isInvalidDomains) {
    return false;
  }

  if (rootDomain.length > 253 || domains.length < 2) {
    return false;
  }

  // Validate top level domain
  if (!domains[domains.length - 1].match(topLevelDomainRegex)) {
    return false;
  }

  return true;
};

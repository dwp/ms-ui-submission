/**
 * Works hand in hand with the core CASA `postalAddressObject` form macro.
 *
 * The errors sent back from this validator are specific to each subfield. For
 * example, if the field name being tested is "address", any errors related to
 * the "postcode" component would be associated with "address[postcode]".
 *
 * Bound attributes:
 *   string|object errorMsg = General error message for the entire address block
 *   string|object errorMsgAddress1 = Error message for address1 part required
 *   string|object errorMsgAddress1Format = Error message for address1 part in wrong format
 *   string|object errorMsgAddress2 = Error message for address2 part required
 *   string|object errorMsgAddress2Format = Error message for address2 part in wrong format
 *   string|object errorMsgAddress3 = Error message for address3 part required
 *   string|object errorMsgAddress3Format = Error message for address3 part in wrong format
 *   string|object errorMsgAddress4 = Error message for address4 part required
 *   string|object errorMsgAddress4Format = Error message for address4 part in wrong format
 *   string|object errorMsgPostcode = Error message for postcode part required
 *   string|object errorMsgPostcodeFormat = Error message for address1 part in wrong format
 *   string altRegex = Alternative regular expression for address lines
 *   int strlenmax = Max. string length for each of the address lines [1-4]
 *   array requiredFields = Field parts required (others become optional)
 *
 * @param {object} value Address object to test
 * @return {Promise} Promise
 */
function postalAddressObject(value) {
  const trimmedValue = value;
  trimmedValue.postcode = value.postcode.replace(/\s/g, '');
  const cfg = {
    requiredFields: ['address1', 'address3', 'postcode'],
    strlenmax: undefined,
    altRegex: undefined,
    errorMsgAddress1: {
      inline: 'macros:errors.address1.required',
      summary: 'macros:errors.address1.required',
      focusSuffix: '[address1]',
    },
    errorMsgAddress1Format: {
      inline: 'macros:errors.address1.badFormat',
      summary: 'macros:errors.address1.badFormat',
      focusSuffix: '[address1]',
    },
    errorMsgAddress2: {
      inline: 'macros:errors.address2.required',
      summary: 'macros:errors.address2.required',
      focusSuffix: '[address2]',
    },
    errorMsgAddress2Format: {
      inline: 'macros:errors.address1.badFormat',
      summary: 'macros:errors.address1.badFormat',
      focusSuffix: '[address2]',
    },
    errorMsgAddress3: {
      inline: 'macros:errors.address3.required',
      summary: 'macros:errors.address3.required',
      focusSuffix: '[address3]',
    },
    errorMsgAddress3Format: {
      inline: 'macros:errors.address3.badFormat',
      summary: 'macros:errors.address3.badFormat',
      focusSuffix: '[address3]',
    },
    errorMsgAddress4: {
      inline: 'macros:errors.address4.required',
      summary: 'macros:errors.address4.required',
      focusSuffix: '[address4]',
    },
    errorMsgAddress4Format: {
      inline: 'macros:errors.address4.badFormat',
      summary: 'macros:errors.address4.badFormat',
      focusSuffix: '[address4]',
    },
    errorMsgPostcode: {
      inline: 'macros:errors.postcode.required',
      summary: 'macros:errors.postcode.required',
      focusSuffix: '[postcode]',
    },
    errorMsgPostcodeFormat: {
      inline: 'macros:errors.postcode.badFormat',
      summary: 'macros:errors.postcode.badFormat',
      focusSuffix: '[postcode]',
    },
    errorMsg: {
      inline: 'macros:errors.address.required',
      summary: 'macros:errors.address.required',
      focusSuffix: '[address1]',
    },
    ...this,
  };

  /* eslint-disable-next-line require-jsdoc */
  const objectifyError = (err) => (typeof err === 'string' ? {
    inline: err,
    summary: err,
  } : err);

  // Work out required/optional parts based on config
  const reqF = {};
  const reqC = cfg.requiredFields;
  ['address1', 'address2', 'address3', 'address4', 'postcode'].forEach((k) => {
    reqF[k] = reqC.indexOf(k) > -1;
  });

  let valid = true;
  const errorMsgs = [];

  if (typeof trimmedValue === 'object') {
    const reAddrRegex = /^[^\s]+[a-z0-9\-,.&#()/\\:;'" ]+$/i;
    const reAddrAltRegex = cfg.altRegex || /^\d+|[^\s]+[a-z0-9\-,.&#()/\\:;'" ]+$/i;
    // UK Postcode regex taken from the dwp java pc checker
    // https://github.com/dwp/postcode-format-validation
    const pc = /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9](([0-9]?)|([ABEHMNPRVWXY]?))|([0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))) ?[0-9]((?![CIKMOV])[A-Z]){2}$|^(BFPO)[ ]?[0-9]{1,4}$/i;
    const rePostcode = new RegExp(pc, 'i');

    // [required, regex, strlenmax, required error message, bad format error message ]
    const attributes = {
      address1: [reqF.address1, reAddrRegex, cfg.strlenmax, cfg.errorMsgAddress1,
        cfg.errorMsgAddress1Format],
      address2: [reqF.address2, reAddrRegex, cfg.strlenmax, cfg.errorMsgAddress2,
        cfg.errorMsgAddress2Format],
      address3: [reqF.address3, reAddrAltRegex, cfg.strlenmax, cfg.errorMsgAddress3,
        cfg.errorMsgAddress3Format],
      address4: [reqF.address4, reAddrRegex, cfg.strlenmax, cfg.errorMsgAddress4,
        cfg.errorMsgAddress4Format],
      postcode: [reqF.postcode, rePostcode, null, cfg.errorMsgPostcode, cfg.errorMsgPostcodeFormat],
    };
    Object.keys(attributes).forEach((k) => {
      const attr = attributes[k];
      const hasProperty = Object.prototype.hasOwnProperty.call(trimmedValue, k);
      const hasContent = hasProperty && value[k].length > 0;
      let attMissing = false;
      if (attr[0] && !hasContent) {
        attMissing = true;
      }
      const attRegexMismatch = !attMissing && (!hasProperty || !trimmedValue[k].match(attr[1]));
      const condExceedStrlen = attr[2] > 0 && hasContent
        && String(trimmedValue[k]).length > attr[2];
      if (attMissing) {
        valid = false;
        errorMsgs.push({
          ...objectifyError(attr[3]),
          fieldKeySuffix: `[${k}]`,
        });
      } else if (hasContent && (attRegexMismatch || condExceedStrlen)) {
        valid = false;
        errorMsgs.push({
          ...objectifyError(attr[4]),
          fieldKeySuffix: `[${k}]`,
        });
      }
    });
  } else {
    valid = false;
    errorMsgs.push(cfg.errorMsg);
  }

  return valid ? Promise.resolve() : Promise.reject(errorMsgs);
}

module.exports = postalAddressObject;

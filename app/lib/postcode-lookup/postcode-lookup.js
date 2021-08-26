const postcodeList = require('./postcode-list.json');

exports.postcodeLookup = (postcode) => {
  const trimmedPostcode = postcode.replace(/\s/g, '');
  const postcodeInitial = trimmedPostcode.substring(0, trimmedPostcode.length - 3).toUpperCase();
  return postcodeList.postcodes.includes(postcodeInitial);
};

import { readFileSync } from 'fs';

const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const postcodeList = loadJSON('./postcode-list.json');

export function postcodeLookup(postcode) {
  const trimmedPostcode = postcode.replace(/\s/g, '');
  const postcodeInitial = trimmedPostcode.substring(0, trimmedPostcode.length - 3).toUpperCase();
  return postcodeList.postcodes.includes(postcodeInitial);
};

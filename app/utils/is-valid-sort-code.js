import { ValidationError } from '../../src/casa';

const isSortCode = /^([0-9])*$/;

const isValidSortCode = (errorMsg) => ({
  name: 'isValidSortCode',

  validate: (fieldValue = '') => {
    const trimmedValue = fieldValue.replace(/\s/g, '');

    if (isSortCode.test(trimmedValue) && (trimmedValue.length) === 6) {
      return [];
    }

    return [
      ValidationError.make({
        errorMsg,
      }),
    ];
  },

  sanitise: (fieldValue) => Number(fieldValue || ''),
});

export default isValidSortCode;

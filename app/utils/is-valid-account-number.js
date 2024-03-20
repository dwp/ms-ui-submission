import { ValidationError } from '../../src/casa';

const isValidAccountNumber = (errorMsg) => ({
  name: 'isValidAccountNumber',

  validate: (fieldValue = '') => {
    const trimmedValue = fieldValue.replace(/\s/g, '');

    if (isValidAccountNumber.test(trimmedValue) && (trimmedValue.length) === 8) {
      return [];
    }

    return [
      ValidationError.make({
        errorMsg,
      }),
    ];
  },

  santise: (fieldValue) => Number(fieldValue || ''),
});

export default isValidAccountNumber;

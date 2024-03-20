import { expect } from 'chai';
/**
 * Expect a validator to fail.
 *
 * @param {object} field List of validators to test.
 * @param {string} waypoint Waypoint of page being validated.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} journeyContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @returns {Promise} Pending processor.
 */
const expectValidatorToFailWithJourney = async (
  field,
  waypoint,
  fieldName,
  validatorName,
  journeyContext = {},
  errorObj = {},
) => {
  const fieldValue = journeyContext[fieldName] !== undefined
    ? journeyContext[fieldName] : journeyContext.data[waypoint][fieldName];

  const context = {
    fieldName,
    fieldValue,
    waypoint,
    journeyContext,
  };
  const errors = field.runValidators(fieldValue, context);
  expect(errors).to.have.length.greaterThanOrEqual(1);
  expect(errors).to.have.nested.property('[0].message', errorObj.summary);
};
/**
 * Expect a validator to fail.
 *
 * @param {object} field List of validators to test.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @param {string} waypoint Waypoint of page being validated.
 * @returns {Promise} Pending processor.
 */
const expectValidatorToFail = async (
  field,
  fieldName,
  validatorName,
  pageDataContext = {},
  errorObj = {},
  waypoint,
) => {
  await expectValidatorToFailWithJourney(
    field,
    waypoint,
    fieldName,
    validatorName,
    pageDataContext,
    errorObj,
  );
};
/**
 * Expect a validator to pass.
 *
 * @param {object} field List of validators to test.
 * @param {string} waypoint Waypoint of page being validated.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to not to be present.
 * @param {object} journeyContext Value to pass into processor.
 * @returns {Promise} Pending processor.
 */
const expectValidatorToPassWithJourney = async (
  field,
  waypoint,
  fieldName,
  validatorName,
  journeyContext = {},
) => {
  const fieldValue = journeyContext[fieldName] ? journeyContext[fieldName] : journeyContext.data[waypoint][fieldName];

  const context = {
    fieldName,
    fieldValue,
    waypoint,
    journeyContext,
  };
  const errors = field.runValidators(fieldValue, context);
  expect(errors).to.have.length(0);
};

/**
 * Expect a validator to fail.
 *
 * @param {object} field List of validators to test.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @param {string} waypoint Waypoint of page being validated.
 * @returns {Promise} Pending processor.
 */
const expectValidatorToPass = async (
  field,
  fieldName,
  validatorName,
  pageDataContext = {},
  waypoint,
) => {
  await expectValidatorToPassWithJourney(
    field,
    waypoint,
    fieldName,
    validatorName,
    pageDataContext,
  );
};
export default {
  expectValidatorToFailWithJourney,
  expectValidatorToFail,
  expectValidatorToPassWithJourney,
  expectValidatorToPass,
};

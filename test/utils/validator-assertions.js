// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('chai');
const validationProcessor = require('@dwp/govuk-casa/lib/validation/processor');
/**
 * Expect a validator to fail.
 *
 * @param {object} fieldValidators List of validators to test.
 * @param {string} waypointId Waypoint of page being validated.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} journeyContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @returns {Promise} Pending processor.
 */
async function expectValidatorToFailWithJourney(
  fieldValidators,
  waypointId,
  fieldName,
  validatorName,
  journeyContext = {},
  errorObj = {},
) {
  try {
    await validationProcessor(
      fieldValidators,
      journeyContext,
      { reduceErrors: true },
    );
    throw new Error('UNEXPECTED_PASS');
  } catch (errors) {
    const result = (errors[fieldName] || []).filter((r) => (r.validator === validatorName))[0];
    /* eslint-disable-next-line no-unused-expressions */
    expect(result).to.not.be.undefined;
    expect(result).to.deep.include(errorObj);
  }
}
/**
 * Expect a validator to fail.
 *
 * @param {object} fieldValidators List of validators to test.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @returns {Promise} Pending processor.
 */
async function expectValidatorToFail(
  fieldValidators,
  fieldName,
  validatorName,
  pageDataContext = {},
  errorObj = {},
) {
  const fakeWaypoint = 'test';
  await expectValidatorToFailWithJourney(
    fieldValidators,
    fakeWaypoint,
    fieldName,
    validatorName,
    pageDataContext,
    errorObj,
  );
}
/**
 * Expect a validator to pass.
 *
 * @param {object} fieldValidators List of validators to test.
 * @param {string} waypointId Waypoint of page being validated.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to not to be present.
 * @param {object} journeyContext Value to pass into processor.
 * @returns {Promise} Pending processor.
 */
async function expectValidatorToPassWithJourney(
  fieldValidators,
  waypointId,
  fieldName,
  validatorName,
  journeyContext = {},
) {
  try {
    await validationProcessor({
      pageMeta: {
        fieldValidators,
      },
      waypointId,
      journeyContext,
      reduceErrors: true,
    });
  } catch (errors) {
    const result = (errors[fieldName] || []).filter((r) => (r.validator === validatorName))[0];
    /* eslint-disable-next-line no-unused-expressions */
    expect(result).to.be.undefined;
  }
}
/**
 * Expect a validator to fail.
 *
 * @param {object} fieldValidators List of validators to test.
 * @param {string} fieldName Name of field to extract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @returns {Promise} Pending processor.
 */
async function expectValidatorToPass(
  fieldValidators,
  fieldName,
  validatorName,
  pageDataContext = {},
) {
  const fakeWaypoint = 'test';
  await expectValidatorToPassWithJourney(
    fieldValidators,
    fakeWaypoint,
    fieldName,
    validatorName,
    pageDataContext,
  );
}
module.exports = {
  expectValidatorToFailWithJourney,
  expectValidatorToFail,
  expectValidatorToPassWithJourney,
  expectValidatorToPass,
};

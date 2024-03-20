import Logger from '../../../src/lib/logger.js';
import { postcodeLookup } from '../../../src/lib/postcode-lookup/postcode-lookup.js';
import { JourneyContext } from '@dwp/govuk-casa';

const appLogger = Logger();
const prerender = (req, res, next) => {
  res.locals.errorsFlag = req.casa.journeyContext.getData(req, 'address');
  next();
};

const postvalidate = (req, res, next) => {
  appLogger.info('Navigation rules: address');
  const { postcode } = req.casa.journeyContext.data.address.address;
  let isWelsh = false;
  if (postcode !== '') {
    isWelsh = postcodeLookup(postcode);
    req.casa.journeyContext.data.postcode = { welsh: isWelsh };
  }
  if (!isWelsh) {
    delete req.casa.journeyContext.data['language-preference-writing'];
    delete req.casa.journeyContext.data['language-preference-speaking'];
  }
  const context = req.casa.journeyContext;
  const { address } = context.data.address;
  if (context.data.address.correspondence === 'yes' && address.address1 !== undefined && address.postcode !== undefined) {
    delete req.casa.journeyContext.data['correspondence-address'];
  }
  if (req.casa.editMode) {
    if (context.data.address.correspondence === 'no' && address.address1 !== undefined && address.postcode !== undefined) {
      req.casa.editMode = false;
    } if (isWelsh && context.data.address.correspondence === 'yes' && address.address1 !== undefined && address.postcode !== undefined) {
      if (!context.data['language-preference-writing'] && !context.data['language-preference-speaking']) {
        req.casa.editMode = false;
      }
    }
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const prevalidate = (req, res, next) => {
  appLogger.info('Navigation rules: address');
  const { address } = req.casa.journeyContext.data;
  const addressObj = address.address;
  addressObj.address1 = addressObj.address1.trim();
  addressObj.address2 = addressObj.address2.trim();
  addressObj.address3 = addressObj.address3.trim();
  addressObj.postcode = addressObj.postcode.replaceAll(' ', '');
  next();
};

export default () => ({
  prerender,
  postvalidate,
  prevalidate,
});

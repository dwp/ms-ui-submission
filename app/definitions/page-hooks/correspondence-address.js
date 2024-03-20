import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  res.locals.errorsFlag = req.casa.journeyContext.getData(req, 'correspondence-address');
  next();
};

const prevalidate = (req, res, next) => {
  const { correspondenceAddress } = req.casa.journeyContext.data['correspondence-address'];
  correspondenceAddress.address1 = correspondenceAddress.address1.trim();
  correspondenceAddress.address2 = correspondenceAddress.address2.trim();
  correspondenceAddress.address3 = correspondenceAddress.address3.trim();
  correspondenceAddress.postcode = correspondenceAddress.postcode.replaceAll(' ', '');
  next();
};

const preredirect = (req, res, next) => {
  const appLogger = logger();

  const { editing } = req.session || null;

  if (editing) {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }

  next();
};
export default () => ({
  prerender,
  prevalidate,
  preredirect,
});

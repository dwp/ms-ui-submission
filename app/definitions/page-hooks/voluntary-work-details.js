const prerender = (req, res, next) => {
  res.locals.cancelForm = true;

  req.session.voluntaryWorkSaved = false;

  req.session.save();
  next();
};

const prevalidate = (req, res, next) => {
  const voluntaryWorkDetails = req.casa.journeyContext.data['voluntary-work-details'];
  const addressObj = voluntaryWorkDetails.organisationAddress;
  addressObj.address1 = addressObj.address1.trim();
  addressObj.address2 = addressObj.address2.trim();
  addressObj.address3 = addressObj.address3.trim();
  addressObj.postcode = addressObj.postcode.replaceAll(' ', '');
  next();
};

export default () => ({
  prerender,
  prevalidate,
});

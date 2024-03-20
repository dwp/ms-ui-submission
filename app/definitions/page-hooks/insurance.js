const prerender = (req, res, next) => {
  // this is added to ensure that the backlink is given the correct
  // value when on a gateway page in a loop
  if (req.session.insuranceGather && req.session.insuranceGather.length > 0) {
    res.locals.casa.journeyPreviousUrl = '/insurance-payment';
  }
  res.locals.insuranceGather = req.session.insuranceGather || [];
  next();
};

export default () => ({
  prerender,
});

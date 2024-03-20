const prerender = (req, res, next) => {
  res.locals.organisationName = req.casa.journeyContext.data['voluntary-work-details'].organisationName;
  res.locals.cancelForm = true;
  next();
};

export default () => ({
  prerender,
});

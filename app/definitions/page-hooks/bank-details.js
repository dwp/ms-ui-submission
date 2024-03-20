const prerender = (req, res, next) => {
  req.casa.journeyContext.setData('bank-details', undefined);
  next();
};

export default () => ({
  prerender,
});

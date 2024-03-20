const prerender = (req, res, next) => {
  res.locals.statutoryPayType = req.casa.journeyContext.data['statutory-pay'].statutoryPay;
  next();
};

export default () => ({
  prerender,
});

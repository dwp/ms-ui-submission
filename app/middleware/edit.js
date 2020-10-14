module.exports = (router) => {
  router.use((req, res, next) => {
    if (req.path === '/check-your-answers') {
      next();
    } else if (typeof req.query.edit !== 'undefined') {
      req.session.editing = true;
      next();
    } else {
      next();
    }
  });
};

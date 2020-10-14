module.exports = (router) => {
  router.use((req, res, next) => {
    res.locals.page_path = req.path;
    next();
  });
};

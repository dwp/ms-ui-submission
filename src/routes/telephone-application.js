export default (router) => {
  router.get('/telephone-application', (req, res) => {
    res.render('pages/cannot-apply-online.njk');
  });
};

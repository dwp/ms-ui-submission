module.exports = (router) => {
  router.get('/accessibility-statement', (req, res) => {
    res.render('pages/accessibility-statement.njk');
  });
};

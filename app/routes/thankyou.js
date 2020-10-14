module.exports = (router) => {
  router.get('/thankyou', (req, res) => {
    res.render('pages/thankyou.njk', { feedbackPath: true });
  });
};

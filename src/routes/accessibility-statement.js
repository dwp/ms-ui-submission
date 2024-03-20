export default (router) => {
  router.get('/accessibility-statement', (req, res) => {
    res.locals.casa.journeyPreviousUrl = 'back';
    res.render('pages/accessibility-statement.njk');
  });
};

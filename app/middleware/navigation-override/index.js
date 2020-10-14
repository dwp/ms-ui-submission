const backLinkRoute = require('./back-link-route');
const navigationOverride = require('./navigation-override');
const backLink = require('./back-link');

module.exports = (router) => {
  backLinkRoute(router);
  router.use(backLink, navigationOverride);
};

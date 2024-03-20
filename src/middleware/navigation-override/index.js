import backLinkRoute from './back-link-route.js';
import navigationOverride from './navigation-override.js';
import backLink from './back-link.js';

export default (router) => {
  backLinkRoute.backLinkRoute(router);
  router.use(backLink, navigationOverride);
};

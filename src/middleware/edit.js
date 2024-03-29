import { MutableRouter } from '@dwp/govuk-casa';

export default () => {
  const router = new MutableRouter();
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

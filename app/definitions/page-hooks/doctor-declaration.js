export default () => [
  {
    hook: 'prerender',
    middleware: (req, res, next) => {
      res.locals.buttonBarHidden = true;
      next();
    },
  }];

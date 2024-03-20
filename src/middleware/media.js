import { static as expressStatic } from 'express';
import { resolve } from 'path';

export default (app, mountUrl, staticDir) => {
  // Deliver project-specific CSS resources
  app.use(
    '/styles.css',
    expressStatic(resolve(staticDir, 'css/ms-ui-submission.css')),
  );
};

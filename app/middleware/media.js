const expressjs = require('express');
const npath = require('path');

module.exports = (app, mountUrl, staticDir) => {
  // Deliver project-specific CSS resources
  app.use(
    '/styles.css',
    expressjs.static(npath.resolve(staticDir, 'css/ms-ui-submission.css')),
  );
};

const { expect } = require('chai');
const pagePath = require('../../../app/middleware/page-path.js');

describe('Page path', () => {
  it('should exist', () => expect(pagePath).to.not.be.undefined);

  it('should set page_path local variable for every page', () => {
    const res = {
      locals: {},
    };
    const router = {
      use: (callback) => {
        callback({
          path: 'test',
        }, res, () => {
          expect(res.locals.page_path).to.equal('test');
        });
      },
    };
    pagePath(router);
  });
});

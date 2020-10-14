const { expect } = require('chai');
const edit = require('../../../app/middleware/edit.js');

describe('edit middleware', () => {
  it('should exist', () => expect(edit).to.not.be.undefined);

  it('should not set edit flag in session if not passed in query', () => {
    const req = {
      query: {},
      session: {},
    };
    const router = {
      use: (callback) => {
        callback(req, {}, () => expect(req.session.editing).be.undefined);
      },
    };
    edit(router);
  });

  it('should not set edit flag in session on check your answers page', () => {
    const req = {
      path: '/check-your-answers',
      query: {
        edit: '',
      },
      session: {},
    };
    const router = {
      use: (callback) => {
        callback(req, {}, () => expect(req.session.editing).be.undefined);
      },
    };
    edit(router);
  });

  it('should set edit flag in session when passed in query', () => {
    const req = {
      query: {
        edit: '',
      },
      session: {},
    };
    const router = {
      use: (callback) => {
        callback(req, {}, () => expect(req.session.editing).be.true);
      },
    };
    edit(router);
  });
});

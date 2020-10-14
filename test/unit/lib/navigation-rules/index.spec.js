const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');

const { assert, expect } = chai;
const navigateToNextPage = rewire('../../../../app/lib/navigation-rules/index');

describe('call the navigation rule if it exists, otherwise call next()', () => {
  let employmentExpenses = sinon.stub().returns();
  let req;
  let res;
  let next;
  let saveFake;
  beforeEach(() => {
    employmentExpenses = sinon.stub().returns();
    res = {
      status: () => ({
        redirect: () => {},
      }),
    };
    saveFake = (cb) => {
      cb();
    };
    req = {
      journeyWaypointId: 'employment-expenses',
      session: {
        editing: true,
        save: sinon.spy(saveFake),
      },
    };
    next = sinon.stub();
  });

  it('should call req.session.save and redirect to correct page if req.session.editing is true', (done) => {
    res = {
      status: () => ({
        redirect: (template) => {
          expect(template).to.equal('/check-your-answers');
        },
      }),
    };
    delete req.journeyWaypointId;
    navigateToNextPage(req, res, next);
    assert(req.session.save.called);
    done();
  });

  it('should call employmentExpenses', () => {
    /* eslint-disable-next-line no-underscore-dangle */
    navigateToNextPage.__set__('rules', { 'employment-expenses': employmentExpenses });
    navigateToNextPage(req, res, next);
    assert(employmentExpenses.called);
    assert(next.notCalled);
  });
  it('should call next()', () => {
    req.session.editing = false;
    delete req.journeyWaypointId;
    navigateToNextPage(req, res, next);
    assert(next.called);
  });
});

const prerender = (req, res, next) => {
  // this is added to ensure that the backlink is given the correct
  // value when on a gateway page in a loop

  req.session.voluntaryWorkSaved = true;

  req.session.save();

  if (req.session.voluntaryGather && req.session.voluntaryGather.length > 0) {
    res.locals.casa.journeyPreviousUrl = '/voluntary-work-hours';
  }

  res.locals.voluntaryGather = req.session.voluntaryGather || [];
  next();
};

const preredirect = (req, res, next) => {
  if (req.casa.editMode && req.casa.journeyContext.data['voluntary-work'].other === 'yes') {
    req.casa.editMode = false;
  }
  next();
};

export default () => ({
  prerender,
  preredirect,
});

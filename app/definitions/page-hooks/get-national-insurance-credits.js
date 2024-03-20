const prerender = (req, res, next) => {
  next();
};

const preredirect = (req, res, next) => {
  if (req.casa.journeyContext.data['get-national-insurance-credits'].whatDoYouWantToDo === 'uc') {
    res.status(302).redirect('https://www.gov.uk/universal-credit');
  } else {
    next();
  }
};

export default () => ({
  prerender,
  preredirect,
});

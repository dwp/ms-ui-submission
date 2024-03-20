import { DateTime } from 'luxon';

const prerender = (req, res, next) => {
  res.locals.dateOfBirthHint = DateTime.now()
    .minus({ years: 16 })
    .toFormat('d M yyyy');
  next();
};

export default () => ({
  prerender,
});

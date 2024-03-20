export default () => [
  {
    hook: 'prevalidate',
    middleware: (req, res, next) => {
      const medicalCentre = req.casa.journeyContext.data['medical-centre'];
      const addressObj = medicalCentre.address;
      addressObj.address1 = addressObj.address1.trim();
      addressObj.address2 = addressObj.address2.trim();
      addressObj.address3 = addressObj.address3.trim();
      addressObj.postcode = addressObj.postcode.replaceAll(' ', '');
      next();
    },
  }];

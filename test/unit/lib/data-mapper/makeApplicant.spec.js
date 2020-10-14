const chai = require('chai');

const { expect } = chai;
const makeApplicant = require('../../../../app/lib/data-mapper/makeApplicant.js');

describe('setting up applicant data for submission', () => {
  const journeyDataValues = {
    'date-of-birth': {
      dateOfBirth: {
        dd: '01',
        mm: '1',
        yyyy: '2020',
      },
    },
    name: {
      firstName: 'test',
      lastName: 'test',
    },
    address: {
      correspondence: 'no',
      correspondenceAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      address: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
    },
    mobile: {
      mobile: 'yes',
      number: '12345123456',
    },
    'other-number': {
      other: 'no',
    },
  };
  const journeyData = {
    getDataForPage: (page) => journeyDataValues[page],
  };
  it('should build an applicant object containing values from inputs', () => {
    const app = makeApplicant(journeyData);
    expect(app).to.have.property('forenames', 'test');
    expect(app).to.have.property('surname', 'test');
    expect(app).to.have.property('dob', '2020-01-01');
    expect(app).to.have.property('residence_address');
    expect(app.residence_address).to.have.property('lines');
    expect(app.residence_address.lines[0]).to.equal('test');
    expect(app.residence_address.lines[1]).to.equal('test');
    expect(app.residence_address.lines[2]).to.equal('test');
    expect(app).to.have.property('contact_options');
    expect(app.contact_options[0]).to.have.property('method', 'telmobile');
    expect(app.contact_options[0]).to.have.property('data', '12345123456');
    expect(app.contact_options[0]).to.have.property('preferred', true);
  });
});

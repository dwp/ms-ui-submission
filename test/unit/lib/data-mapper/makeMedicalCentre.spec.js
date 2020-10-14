const chai = require('chai');

const { expect } = chai;
const makeMedicalCentre = require('../../../../app/lib/data-mapper/makeMedicalCentre.js');

describe('setting up medical centre data for submission', () => {
  const medicalCentre = {
    name: 'mysurgery',
    phoneNumber: '01234512345',
    doctor: 'smith',
    address: {
      address1: '12',
      address2: 'doctor lane',
      address3: 'hereabouts',
      postcode: 'a111aa',
    },
  };
  it('should build a medCentre object containing values from inputs', () => {
    const med = makeMedicalCentre(medicalCentre);
    expect(med).to.have.property('name', 'mysurgery');
    expect(med).to.have.property('tel', '01234512345');
    expect(med).to.have.property('doctor', 'smith');
    expect(med).to.have.property('address');
    expect(med.address).to.have.property('lines');
    expect(med.address.lines[0]).to.equal('12');
    expect(med.address.lines[1]).to.equal('doctor lane');
    expect(med.address.lines[2]).to.equal('hereabouts');
    expect(med.address).to.have.property('premises', '');
    expect(med.address).to.have.property('postcode', 'a111aa');
  });
});

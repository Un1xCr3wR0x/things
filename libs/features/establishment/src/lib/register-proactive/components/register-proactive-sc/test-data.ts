/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

const sampleRegistrationNo = 1234587952;

export const molEstablishment = {
  registrationNo: sampleRegistrationNo
};

export const searchEstablishmentResponse = {
  organizationCategory: null,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
    currentMailingAddress: 'NATIONAL',
    addresses: [
      {
        country: null,
        postBox: null,
        additionalNo: null,
        unitNo: null,
        detailedAddress: null,
        type: 'NATIONAL',
        city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
        buildingNo: null,
        cityDistrict: null,
        district: null,
        postalCode: null,
        streetName: 'true'
      }
    ],
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    }
  },
  crn: {
    number: 12312,
    mciVerified: true,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    registrationNo: null,
    paymentType: null,
    startDate: null,
    bankAccount: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: sampleRegistrationNo,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: null },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: sampleRegistrationNo,
  scanDocuments: null,
  status: 'REGISTERED',
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};
export const searchEstablishmentResponseForMciNotVerified = {
  organizationCategory: null,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
    currentMailingAddress: 'NATIONAL',
    addresses: [
      {
        country: null,
        postBox: null,
        additionalNo: null,
        unitNo: null,
        detailedAddress: null,
        type: 'NATIONAL',
        city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
        buildingNo: null,
        cityDistrict: null,
        district: null,
        postalCode: null,
        streetName: 'true'
      }
    ],
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    }
  },
  crn: {
    number: 12312,
    mciVerified: false,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    paymentType: { arabic: 'لا', english: 'No' },
    registrationNo: 307655073,
    startDate: { gregorian: new Date(), hijri: null },

    bankAccount: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: sampleRegistrationNo,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: null },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: sampleRegistrationNo,
  scanDocuments: null,
  status: 'REGISTERED',
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};
export const saveCRNDetails = {
  organizationCategory: null,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
    address: {
      country: null,
      postBox: null,
      additionalNo: null,
      unitNo: null,
      detailedAddress: null,
      type: 'NATIONAL',
      city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
      buildingNo: null,
      cityDistrict: null,
      district: null,
      postalCode: null,
      streetName: 'true'
    },
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    }
  },
  crn: {
    number: 123,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    registrationNo: null,
    paymentType: null,
    startDate: null,
    bankAccount: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: sampleRegistrationNo,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: 'string' },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: sampleRegistrationNo,
  scanDocuments: null,
  status: 'REGISTERED',
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};

export const paymentDetails = {
  paymentDetails: {
    paymentType: { arabic: 'لا', english: 'No' },
    bankAccount: {
      ibanAccountNo: '2626266626',
      bankName: { arabic: 'اسم المكتب', english: 'Indian' }
    },
    registrationNo: 307655073,
    startDate: { gregorian: new Date(), hijri: null }
  }
};

export const docList = [
  {
    documentContent: null,
    name: {
      arabic: 'string',
      english: 'string'
    },
    required: true,
    reuse: true,
    sequenceNumber: 0
  }
];

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AddressDetails,
  BilingualText,
  BPMUpdateRequest,
  EstablishmentPaymentDetails,
  GosiCalendar,
  IdentityTypeEnum,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { genericAdminResponse } from 'testing/test-data/establishment';
const HIJRI_DATE_2 = '1417-03-01';
export const updateBpmTaskWorkflow = {
  registrationNo: 12354634321,
  taskId: '3423423-23423423-234234',
  user: 'user',
  comments: 'comments'
};

export const genericBpmUpdateRequest: BPMUpdateRequest = {
  registrationNo: 12354634321,
  taskId: '3423423-23423423-234234',
  user: 'user',
  comments: 'comments',
  outcome: undefined,
  isExternalComment: false
};

export const validatorResponseTestData = {
  english: 'string',
  arabic: 'string'
};

export const establishmentAdminDetailsTestData = {
  dateOfBirth: {
    gregorian: new Date()
  },
  name: {
    arabic: {
      firstName: 'string',
      secondName: 'string',
      thirdName: 'string',
      familyName: 'string'
    },
    english: {
      name: 'English Name'
    }
  },
  nationality: {
    code: 1001
  },
  nin: {
    newNin: 1235434846
  },
  passport: {
    passportNo: '1235432135'
  },
  sex: {
    code: 1001
  },
  nationalId: 213213
};

export const contactDetailsList = [
  {
    additionalNo: '',
    buildingNo: '',
    city: { english: 'Almoraba a', arabic: 'المربع' },
    cityDistrict: new BilingualText(),
    country: { english: null, arabic: null },
    detailedAddress: '',
    district: '',
    postBox: '234',
    postalCode: '23423',
    streetName: '',
    type: 'POBOX',
    unitNo: ''
  }
];
export const cancelTransactionTestdata = {
  registrationNo: 234385546,
  revisionList: []
};

export const establishmentNationalAddressDetails = {
  additionalNo: '12345',
  addressLine: 'Near Al Arab Hotel',
  area: 'Riyadh',
  buildingNo: '1234',
  city: 'asdasda',
  streetName: 'string',
  type: '1001',
  postalCode: '12345',
  district: 'Riyadh',
  villageId: 301
};
export const establishmentPoBoxAddressDetails = {
  city: 'asdasda',
  country: { code: 1001 },
  postBox: 1234,
  streetName: 'string',
  type: '1002',
  postalCode: '12345'
};

export const establishmentContactDetails = {
  telephoneNo: {
    extensionPrimary: '123213',
    extensionSecondary: '213123',
    primary: '12323',
    secondary: '23123'
  },
  emailId: {
    primary: 'asdasd@ads.com',
    secondary: ''
  },
  extension: {
    primary: '12345',
    secondary: ''
  },
  mobileNo: { primary: '234234234', isdCodePrimary: '' },

  villageId: 301,
  faxNo: '434F',
  currentMailingAddress: null,
  addresses: []
};

export const establishmentPaymentDetailsData: EstablishmentPaymentDetails = {
  navigationIndicator: undefined,
  referenceNo: undefined,
  registrationNo: 234385546,
  bankAccount: {
    ibanAccountNo: 'SA1234567890',
    bankName: { arabic: 'aaa', english: 'eee' }
  },
  paymentType: { arabic: 'aaa', english: 'eee' },
  startDate: {
    gregorian: new Date(),
    hijiri: HIJRI_DATE_2
  },
  lateFeeIndicator: { english: undefined, arabic: undefined }
};

export const establishmentPaymentDetailsDataService = {
  registrationNo: 234385546,
  bankAccount: {
    ibanAccountNo: 'SA1234567890',
    bankName: { arabic: 'aaa', english: 'eee' }
  },
  paymentType: { arabic: 'aaa', english: 'eee' },
  startDate: {
    gregorian: new Date(),
    hijiri: HIJRI_DATE_2
  }
};

export const AdminData = {
  person: {
    personId: 34234,
    birthDate: {
      gregorian: new Date(),
      hijiri: HIJRI_DATE_2
    },
    education: null,
    specialization: null,
    identity: [],
    role: '',
    deathDate: new GosiCalendar(),
    maritalStatus: 'Single',
    iqama: new Iqama(),
    nin: new NIN(),
    passport: new Passport(),
    name: {
      arabic: {
        firstName: 'ححزخحد',
        secondName: 'ثززخ',
        thirdName: 'خد خثجرث',
        familyName: 'ححزحتز'
      },
      english: {
        name: 'AAA AAA AAA AAA'
      }
    },
    nationality: {
      arabic: null,
      english: 'Saudi Arabia'
    },
    sex: {
      english: 'Male',
      arabic: null
    },
    nationalId: new NationalId(),
    contactDetail: {
      emailId: {
        primary: 'gosi.gov@gmail.com',
        secondary: ''
      },
      mobileNo: { primary: '234234234', isdCodePrimary: '' },

      telephoneNo: {
        primary: '8978654325',
        extensionPrimary: '12354'
      },
      faxNo: '',
      address: new AddressDetails()
    }
  },
  registrationNo: 234385546
};

export const establishmentAdminContactDetailsTestData = {
  emailId: {
    primary: 'gosi.gov@gmail.com',
    secondary: ''
  },
  mobileNo: { primary: '234234234', isdCodePrimary: '' },
  telephoneNo: {
    primary: '8978654325',
    extensionPrimary: '12354'
  }
};

export const adminWithNin = {
  idType: IdentityTypeEnum.NIN,
  role: 'Owner',
  nationality: {
    english: 'Saudi Arabia',
    arabic: 'asdsd'
  },
  newNin: '1092420502',
  birthDate: { gregorian: '2001-09-08', hijiri: '1424-07-01' }
};

export const adminWithIqama = {
  idType: IdentityTypeEnum.IQAMA,
  role: 'Owner',
  iqamaNo: 2000000006,
  birthDate: { gregorian: '2002-09-08', hijiri: '1427-07-01' }
};
export const adminWithGccId = {
  idType: IdentityTypeEnum.NATIONALID,
  role: 'Owner',
  id: 254654362136,
  nationality: {
    english: 'Kuwait',
    arabic: null
  },
  passportNo: '46854321ad',
  iqamaNo: 2000000006,
  birthDate: { gregorian: '2002-09-08', hijiri: '1427-07-01' }
};

export const workFlowValidatorRequestData = {
  taskId: 'aweqw546543asd5734sad',
  outcome: 'success'
};

export const changeMainRequestDate = {
  newMainRegistrationNo: 53678,
  navigationIndicator: 36,
  comments: '',
  contentIds: []
};
export const adminRequestData = {
  currentAdmin: genericAdminResponse,
  newAdmin: genericAdminResponse,
  navigationIndicator: 51,
  comments: '',
  contentIds: []
};
export const delinkRequestData = {
  newMainRegNo: 53678,
  navigationIndicator: 51,
  comments: '',
  contentIds: [],
  branches: [
    {
      registrationNo: 12233,
      recordActionType: 'sds'
    }
  ],
  newAdmin: {
    roles: [3, 5, 6],
    deathDate: null,
    birthDate: null,
    role: '',
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      currentMailingAddress: 'NATIONAL',
      emergencyContactNo: null,
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
          streetName: 'true',
          fromJsonToObject: () => {
            return undefined;
          }
        }
      ],
      emailId: null,
      faxNo: null,
      mobileNo: {
        primary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null,
        secondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      telephoneNo: {
        primary: null,
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    personType: '',

    identity: [{ id: 3048746279, idType: 'BORDERNO' }],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد',
        fromJsonToObject: () => {
          return undefined;
        }
      },
      english: { name: 'Abdulah' },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    nationality: { arabic: 'الكويت', english: 'Kuwait' },
    personId: 1037302935,
    sex: { arabic: 'ذكر', english: 'Male' },
    userPreferences: { commPreferences: 'En', contactPreferences: ['EMAIL', 'SMS'] },
    student: false,
    prisoner: false,
    govtEmp: false,
    socialInsuranceNumber: [],
    fromJsonToObject: () => {
      return undefined;
    }
  }
};

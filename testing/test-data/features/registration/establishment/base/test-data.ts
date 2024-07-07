/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AddressDetails,
  AddressTypeEnum,
  BilingualText,
  bindToObject,
  ContactDetails,
  DocumentItem,
  DocumentResponseItem,
  EmailType,
  Establishment,
  EstablishmentStatusEnum,
  GccCountryEnum,
  GccEstablishment,
  IdentityTypeEnum,
  License,
  MobileDetails,
  NationalityTypeEnum,
  PhoneDetails
} from '@gosi-ui/core';
import {
  Admin,
  ErrorCodeEnum,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  OrganisationTypeEnum,
  ViolationHistoryResponse
} from '@gosi-ui/features/establishment';

const HIJRI_DATE = '';
const GREG_DATE_3 = '1996-07-16';
const HIJRI_DATE_3 = '1417-03-01';
const DATE_TIMESTAMP = '2019-06-13T00:00:00.000Z';
const DATE_TIMESTAMP_2 = '2019-06-01T00:00:00.000Z';
const OPTIONAL_VALIDATION_TEST = 'Optional validations test';
const ACTIVITY = 'Activity 9.6.10';
const REGISTRATION_REQUEST_FORM = 'Registration Request Form or Letter';
const REGISTRATION_REQUEST_FORM_ARABIC = 'نموذج طلب التسجيل';
export const organsationTypes = [
  OrganisationTypeEnum.GOVERNMENT,
  OrganisationTypeEnum.NON_GOVERNMENT,
  OrganisationTypeEnum.GCC
];
const STOCK_SHARE_COMPANY = 'Stock Share Company';
const docResponse = [
  {
    documentName: 'Admin Authorization Letter',
    fileName: 'test.pdf',
    content: 'asdasd',
    id: 'FEAAPPLVD02001268'
  },
  {
    documentName: 'License',
    fileName: 'test.pdf',
    content: 'asdasd',
    id: 'FEAAPPLVD02001267'
  },
  {
    documentName: 'Registration Request Form or Letter',
    fileName: 'test.pdf',
    id: 'FEAAPPLVD02001266',
    content: 'asdasd'
  }
];
export const documentResponse1 = docResponse.map(doc => bindToObject(new DocumentResponseItem(), doc));
export const branches = [
  {
    name: { arabic: 'برنامج مستشفى الملك فهدللحرس الوطني', english: null },
    registrationNo: 924201614,
    status: { arabic: 'مسجلة', english: 'Registered' },
    location: { arabic: 'الرياض', english: 'Riyadh' },
    billAmount: 102455,
    billStatus: 'Paid',
    certificateStatus: true,
    establishmentType: { arabic: 'رئيسية', english: 'Main' },
    closingDate: null,
    fieldOffice: { arabic: 'مكتب منطقة الرياض', english: 'Riyadh R Office' },
    legalEntity: { arabic: 'شبه حكومي', english: 'Semi Government' },
    delinked: false
  }
];
export const genericAddress: AddressDetails = {
  type: AddressTypeEnum.NATIONAL,
  city: { arabic: 'رخو', english: 'Rokho' },
  buildingNo: '1111',
  postalCode: '11391',
  district: 'streetarea',
  streetName: 'Ulala',
  additionalNo: 'null',
  unitNo: null,
  cityDistrict: null,
  country: undefined,
  postBox: undefined,
  detailedAddress: undefined,
  fromJsonToObject: () => {
    return undefined;
  }
};

export const genericTelephoneNo: PhoneDetails = {
  primary: '0112153626',
  extensionPrimary: null,
  secondary: null,
  extensionSecondary: null,
  fromJsonToObject: () => {
    return undefined;
  }
};

export const genericMobileNo: MobileDetails = {
  primary: '0501206817',
  secondary: null,
  isdCodePrimary: 'sa',
  isdCodeSecondary: null,
  fromJsonToObject: () => {
    return undefined;
  }
};

export const genericEmailId: EmailType = {
  primary: 'hr@al-bilad.com',
  fromJsonToObject: () => {
    return new EmailType();
  }
};

export const genericContactDetails: ContactDetails = {
  currentMailingAddress: undefined,
  addresses: [genericAddress],
  emailId: genericEmailId,
  telephoneNo: genericTelephoneNo,
  mobileNo: genericMobileNo,
  mobileNoVerified: true,
  createdBy: null,
  createdDate: null,
  lastModifiedBy: '',
  lastModifiedDate: null,
  faxNo: null,
  emergencyContactNo: null,
  fromJsonToObject: () => {
    return undefined;
  }
};

const ests = [
  //1.  Non Government Establishment with legal entity Organisationl International
  {
    gccEstablishment: null,
    establishmentAccount: null,
    crn: null,
    molEstablishmentIds: null,
    navigationIndicator: null,
    fieldOfficeName: undefined,
    registrationCompleted: false,
    activityType: { english: '', arabic: '' },
    gccCountry: false,
    establishmentType: {
      english: EstablishmentTypeEnum.MAIN,
      arabic: null
    },
    nationalityCode: {
      english: NationalityTypeEnum.SAUDI_NATIONAL,
      arabic: null
    },
    registrationNo: 547269814,
    name: {
      arabic: 'asdasd',
      english: null
    },

    proactive: null,
    legalEntity: {
      english: LegalEntityEnum.ORG_REGIONAL,
      arabic: null
    },
    license: {
      issueDate: {
        gregorian: new Date(DATE_TIMESTAMP),
        hijiri: ''
      },
      issuingAuthorityCode: { english: 'Ministry of Education', arabic: null },
      number: 65234234,
      expiryDate: {
        gregorian: null,
        hijiri: ''
      }
    },
    mainEstablishmentRegNo: 0,
    organizationCategory: {
      english: OrganisationTypeEnum.NON_GOVERNMENT,
      arabic: null
    },
    recruitmentNo: 0,
    startDate: {
      gregorian: new Date(DATE_TIMESTAMP_2),
      hijiri: ''
    },
    contactDetails: genericContactDetails,
    status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' },
    scanDocuments: [
      {
        contentId: 'FEAAPPLVD01.GOSI.004188',
        type: {
          english: REGISTRATION_REQUEST_FORM,
          arabic: null
        }
      },
      {
        contentId: 'FEAAPPLVD01.GOSI.004189',
        type: { english: 'License', arabic: null }
      },
      {
        contentId: 'FEAAPPLVD01.GOSI.004190',
        type: { english: 'Financial Guarantee', arabic: null }
      },
      {
        contentId: 'FEAAPPLVD01.GOSI.004191',
        type: { english: 'MOF Financial Guarantee', arabic: null }
      },
      {
        contentId: 'FEAAPPLVD01.GOSI.004192',
        type: { english: 'Admin Authorization Letter', arabic: null }
      }
    ],
    transactionReferenceData: [],
    comments: OPTIONAL_VALIDATION_TEST,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },
  //2. Government Establishment with legal entity Government
  {
    gccEstablishment: null,
    establishmentAccount: null,
    crn: null,
    molEstablishmentIds: null,
    navigationIndicator: null,
    proactive: null,
    fieldOfficeName: undefined,
    registrationCompleted: false,
    activityType: { english: ACTIVITY, arabic: null },
    gccCountry: false,
    establishmentType: {
      english: EstablishmentTypeEnum.MAIN,
      arabic: null
    },
    nationalityCode: {
      english: NationalityTypeEnum.SAUDI_NATIONAL,
      arabic: null
    },
    registrationNo: 547269814,
    name: {
      arabic: 'asdasd',
      english: null
    },
    legalEntity: {
      english: LegalEntityEnum.GOVERNMENT,
      arabic: null
    },
    license: {
      issueDate: {
        gregorian: new Date(DATE_TIMESTAMP),
        hijiri: ''
      },
      issuingAuthorityCode: { english: '', arabic: null },
      number: 65234234,
      expiryDate: {
        gregorian: null,
        hijiri: ''
      }
    },
    mainEstablishmentRegNo: 0,
    organizationCategory: {
      english: OrganisationTypeEnum.GOVERNMENT,
      arabic: null
    },
    recruitmentNo: 0,
    startDate: {
      gregorian: new Date(DATE_TIMESTAMP_2),
      hijiri: ''
    },

    contactDetails: genericContactDetails,
    status: undefined,
    scanDocuments: [],
    transactionReferenceData: [],
    comments: OPTIONAL_VALIDATION_TEST,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },
  // 3. GCC Establishment with legal entity Individual
  {
    registrationNo: 547269814,
    gccEstablishment: new GccEstablishment(),
    establishmentAccount: null,
    crn: null,
    molEstablishmentIds: null,
    navigationIndicator: null,
    proactive: null,
    contactDetails: genericContactDetails,
    status: undefined,
    fieldOfficeName: new BilingualText(),
    registrationCompleted: false,
    activityType: { english: ACTIVITY, arabic: null },
    gccCountry: true,
    establishmentType: {
      english: EstablishmentTypeEnum.MAIN,
      arabic: null
    },
    nationalityCode: {
      english: GccCountryEnum.KUWAIT,
      arabic: null
    },
    legalEntity: {
      english: LegalEntityEnum.PARTNERSHIP,
      arabic: null
    },
    license: {
      issueDate: {
        gregorian: new Date(DATE_TIMESTAMP),
        hijiri: ''
      },
      issuingAuthorityCode: { english: null, arabic: null },
      number: 65234234,
      expiryDate: {
        gregorian: null,
        hijiri: ''
      }
    },
    organizationCategory: {
      english: OrganisationTypeEnum.GCC,
      arabic: null
    },
    name: {
      arabic: 'asdasd',
      english: null
    },

    mainEstablishmentRegNo: 0,
    recruitmentNo: 0,
    startDate: {
      gregorian: new Date(DATE_TIMESTAMP_2),
      hijiri: ''
    },
    scanDocuments: [],
    transactionReferenceData: [],
    comments: OPTIONAL_VALIDATION_TEST,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },
  // 4. GCC Establishment with legal entity partnership
  {
    gccEstablishment: new GccEstablishment(),
    establishmentAccount: null,
    crn: null,
    molEstablishmentIds: null,
    navigationIndicator: null,
    proactive: null,
    contactDetails: genericContactDetails,
    status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' },
    registrationCompleted: false,
    fieldOfficeName: undefined,
    activityType: { english: ACTIVITY, arabic: null },
    gccCountry: false,
    establishmentType: {
      english: EstablishmentTypeEnum.MAIN,
      arabic: null
    },
    nationalityCode: {
      english: GccCountryEnum.KUWAIT,
      arabic: null
    },
    legalEntity: {
      english: LegalEntityEnum.INDIVIDUAL,
      arabic: null
    },
    license: {
      issueDate: {
        gregorian: new Date(DATE_TIMESTAMP),
        hijiri: ''
      },
      issuingAuthorityCode: { english: null, arabic: null },
      number: 65234234,
      expiryDate: {
        gregorian: null,
        hijiri: ''
      }
    },
    organizationCategory: {
      english: OrganisationTypeEnum.GCC,
      arabic: null
    },

    registrationNo: 547269814,
    name: {
      arabic: 'asdasd',
      english: null
    },

    mainEstablishmentRegNo: 213513513,
    recruitmentNo: 0,
    startDate: {
      gregorian: new Date(DATE_TIMESTAMP_2),
      hijiri: ''
    },
    scanDocuments: [],
    transactionReferenceData: [],
    comments: OPTIONAL_VALIDATION_TEST,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },
  //5. GCC branch
  {
    establishmentType: { english: 'Branch', arabic: 'فرع ' },
    legalEntity: { english: 'Government', arabic: 'حكومي' },
    license: {
      issueDate: {
        gregorian: new Date('2019-07-02T00:00:00.000Z'),
        hijiri: ''
      },
      issuingAuthorityCode: {
        english: 'Ministry of External Affairs',
        arabic: 'وزارة الخارجية '
      },
      number: 23324523,
      expiryDate: { gregorian: null, hijiri: '' }
    },
    mainEstablishmentRegNo: 924201479,
    organizationCategory: { english: 'Government', arabic: null },
    gccEstablishment: null,
    establishmentAccount: null,
    crn: null,
    molEstablishmentIds: null,
    navigationIndicator: null,
    fieldOfficeName: undefined,
    registrationCompleted: false,
    activityType: { english: '', arabic: '' },
    gccCountry: false,
    nationalityCode: {
      english: NationalityTypeEnum.SAUDI_NATIONAL,
      arabic: null
    },
    registrationNo: 547269814,
    name: {
      arabic: 'asdasd',
      english: null
    },

    proactive: null,
    recruitmentNo: 0,
    startDate: {
      gregorian: new Date(DATE_TIMESTAMP_2),
      hijiri: ''
    },
    contactDetails: genericContactDetails,
    status: { english: EstablishmentStatusEnum.CANCELLED, arabic: 'test' },
    scanDocuments: [],
    transactionReferenceData: [],
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  }
];

export const establishmentTestData: Establishment[] = ests.map(item => ({ ...new Establishment(), ...item }));

export const saveGccDetails = {
  //6.Save GCC Establishment Data
  establishmentDetails: {
    establishmentAccount: null,
    gccEstablishment: {
      country: { english: 'Qatar', arabic: 'قطر' },
      gccCountry: true,
      registrationNo: '234sad23'
    },
    activityType: {
      arabic: 'الفنون المسرحية والتشكيلية ',
      english: 'Activity 9.6.11'
    },
    establishmentType: { english: 'Main', arabic: null },
    nationalityCode: { arabic: 'سوريا', english: 'Syria' },
    registrationNo: 547269814,
    name: { arabic: 'شسيبشسي', english: null },
    legalEntity: {
      english: STOCK_SHARE_COMPANY,
      arabic: 'منشأة مساهمة'
    },
    license: null,
    mainEstablishmentRegNo: 0,
    organizationCategory: { english: 'GCC', arabic: null },
    recruitmentNo: 0,
    startDate: { gregorian: new Date('2019-05-01T00:00:00.000Z'), hijiri: '' },
    contactDetails: {
      emailId: { primary: '' },
      faxNo: '',
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' },
      currentMailingAddress: null,
      addresses: [
        {
          country: { english: 'Bahrain', arabic: 'البحرين ' },
          city: { english: 'asdasd', arabic: null },
          postalCode: '',
          postBox: '',
          buildingNo: '',
          district: '',
          cityDistrict: null,
          streetName: '',
          additionalNo: '',
          unitNo: '',
          type: 'OVERSEAS',
          detailedAddress: 'asdasd'
        }
      ]
    },
    status: undefined,
    scanDocuments: [],
    transactionReferenceData: [],
    crn: { number: 0, issueDate: { gregorian: null, hijiri: '' } },
    molEstablishmentIds: {
      molEstablishmentId: null,
      molEstablishmentOfficeId: null,
      molOfficeId: null,
      molunId: null
    },
    proactive: false,
    navigationIndicator: 1,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },

  establishmentContact: {
    contactDetails: {
      emailId: { primary: '' },
      faxNo: '',
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' },
      address: {
        country: { english: 'Bahrain', arabic: 'البحرين ' },
        city: { english: 'asdasd', arabic: null },
        postalCode: '',
        postBox: '',
        buildingNo: '',
        district: '',
        cityDistrict: null,
        streetName: '',
        additionalNo: '',
        unitNo: '',
        type: 'OVERSEAS',
        detailedAddress: 'asdasd'
      }
    }
  },
  addressDetails: [
    {
      address: {
        country: { english: 'Bahrain', arabic: 'البحرين ' },
        city: { english: 'asdasd', arabic: null },
        postalCode: '',
        postBox: '',
        buildingNo: '',
        district: '',
        cityDistrict: null,
        streetName: '',
        additionalNo: '',
        unitNo: '',
        type: 'OVERSEAS',
        detailedAddress: 'asdasd'
      }
    }
  ]
};

export const molEstablishment = {
  //7.Save MOL Establishment Data
  establishmentDetails: {
    establishmentAccount: null,
    gccEstablishment: null,
    activityType: {
      arabic: 'الفنون المسرحية والتشكيلية ',
      english: 'Activity 9.6.11'
    },
    establishmentType: { english: 'Main', arabic: null },
    nationalityCode: { arabic: 'سوريا', english: 'Syria' },
    registrationNo: 547269814,
    name: { arabic: 'شسيبشسي', english: null },
    legalEntity: {
      english: LegalEntityEnum.ORG_REGIONAL,
      arabic: 'منشأة مساهمة'
    },
    license: {
      expiryDate: { gregorian: null, hijiri: '' },
      issueDate: { gregorian: new Date('16-07-1996'), hijiri: '' },
      issuingAuthorityCode: {
        english: 'Ministry of health',
        arabic: 'وزارة الصحة '
      },
      number: null
    },
    mainEstablishmentRegNo: 0,
    organizationCategory: { english: 'GCC', arabic: null },
    recruitmentNo: 0,
    startDate: { gregorian: new Date('2019-05-01T00:00:00.000Z'), hijiri: '' },
    contactDetails: {
      emailId: { primary: '' },
      faxNo: '',
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' },
      address: {
        country: { english: 'Bahrain', arabic: 'البحرين ' },
        city: { english: 'asdasd', arabic: null },
        postalCode: '',
        postBox: '',
        buildingNo: '',
        district: '',
        cityDistrict: null,
        streetName: '',
        additionalNo: '',
        unitNo: '',
        type: 'OVERSEAS',
        detailedAddress: 'asdasd'
      }
    },
    status: undefined,
    scanDocuments: [],
    transactionReferenceData: [],
    crn: { number: 0, issueDate: { gregorian: null, hijiri: '' } },
    molEstablishmentIds: {
      molEstablishmentId: null,
      molEstablishmentOfficeId: null,
      molOfficeId: null,
      molunId: null
    },
    proactive: true,
    navigationIndicator: 1,
    validatorEdited: false,
    adminRegistered: false,
    transactionTracingId: 135
  },
  establishmentContact: {
    contactDetails: {
      emailId: { primary: '' },
      faxNo: '',
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' },
      address: {
        country: { english: 'Bahrain', arabic: 'البحرين ' },
        city: { english: 'asdasd', arabic: null },
        postalCode: '',
        postBox: '',
        buildingNo: '',
        district: '',
        cityDistrict: null,
        streetName: '',
        additionalNo: '',
        unitNo: '',
        type: 'OVERSEAS',
        detailedAddress: 'asdasd'
      }
    }
  },
  addressDetails: [
    {
      address: {
        country: { english: 'Bahrain', arabic: 'البحرين ' },
        city: { english: 'asdasd', arabic: null },
        postalCode: '',
        postBox: '',
        buildingNo: '',
        district: '',
        cityDistrict: null,
        streetName: '',
        additionalNo: '',
        unitNo: '',
        type: 'OVERSEAS',
        detailedAddress: 'asdasd'
      }
    }
  ]
};

export const estNotFoundError = {
  error: {
    code: ErrorCodeEnum.EST_NO_RECORD,
    message: {
      english: 'No Establishment',
      arabic: 'No Establishment12'
    }
  }
};

export const mockError = {
  error: {
    code: 'ERR_OTHERS',
    message: {
      english: 'No Establishment2',
      arabic: 'No Establishment123'
    }
  }
};

export const verifyOwner = {
  birthDate: { gregorian: new Date('05-05-1981'), hijiri: '' },
  id: '549875647622',
  idType: 'GCCID',
  iqamaNo: null,
  nationality: { english: 'Kuwait', arabic: 'الكويت' },
  newNin: null,
  passportNo: null
};

export const verifyOwnerInDb = {
  birthDate: { gregorian: new Date(), hijiri: '' },
  id: null,
  idType: 'GCCID',
  iqamaNo: '2000000006',
  nationality: { english: 'Kuwait', arabic: 'الكويت' },
  newNin: null,
  passportNo: null
};

export const verifyErrorRequest = {
  birthDate: { gregorian: new Date('05-05-1981'), hijiri: '' },
  id: '123456789',
  idType: 'GCCID',
  iqamaNo: null,
  nationality: { english: 'Kuwait', arabic: 'الكويت' },
  newNin: null,
  passportNo: null
};

export const adminNotFoundError = {
  error: {
    code: ErrorCodeEnum.ADMIN_NO_RECORD,
    message: {
      english: 'No person1',
      arabic: 'No person2'
    }
  }
};

export const getOwnerError = {
  error: {
    code: ErrorCodeEnum.OWNER_NO_RECORD,
    message: {
      english: 'No owner',
      arabic: 'No owner1'
    }
  }
};

export const getAdminError = {
  error: {
    code: ErrorCodeEnum.ADMIN_NO_RECORD,
    message: {
      english: 'No owner',
      arabic: 'No owner1'
    }
  }
};

export const verifyOwnerErrorResponse = [
  {
    error: {
      code: ErrorCodeEnum.PERSON_NO_RECORD,
      message: {
        english: 'No owner',
        arabic: 'No owner1'
      }
    }
  },
  {
    error: {
      code: 'error',
      message: {
        english: '',
        arabic: ''
      }
    }
  }
];

export const verifyOwnerResponse = {
  birthDate: {
    gregorian: GREG_DATE_3,
    hijiri: HIJRI_DATE_3
  },
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS'
    },
    emailId: {},
    faxNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: '35weera234234as'
    },
    {
      idType: 'IQAMA',
      iqamaNo: 2000000006
    },
    {
      id: 234234234234,
      idType: 'GCCID'
    }
  ],
  maritalStatus: { arabic: 'اعزب', english: 'Unavailable' },
  name: {
    arabic: { firstName: 'asd', familyName: 'asd' },
    english: {}
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};
//birth date Gregorian
const BIRTHDATE_GREG = '16-07-1996';
export const verifyAdminData = {
  birthDate: {
    gregorian: new Date(BIRTHDATE_GREG),
    hijiri: ''
  },
  id: null,
  idType: 'GCCID',
  iqamaNo: '2000000006',
  nationality: { english: 'Kuwait', arabic: 'الكويت' },
  newNin: null,
  role: 'Admin',
  passportNo: null
};

export const verifyAdminResponse = {
  birthDate: {
    gregorian: GREG_DATE_3,
    hijiri: HIJRI_DATE_3
  },
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS'
    },
    emailId: {},
    faxNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: '35weera234234as'
    },
    {
      idType: 'IQAMA',
      iqamaNo: 2000000006
    },
    {
      id: 234234234234,
      idType: 'GCCID'
    }
  ],
  maritalStatus: { arabic: 'اعزب', english: 'Unavailable' },
  name: {
    arabic: { firstName: 'asd', familyName: 'asd' },
    english: {}
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};

export const saveAdminData = {
  address: {
    additionalNo: '',
    buildingNo: '',
    city: { english: null, arabic: null },
    cityDistrict: null,
    country: { english: null, arabic: null },
    detailedAddress: '',
    district: '',
    postBox: '',
    postalCode: '',
    streetName: '',
    type: null,
    unitNo: ''
  },
  contactDetails: {
    emailId: { primary: '' },
    mobileNo: { primary: '234234347', isdCodePrimary: '' },
    telephoneNo: { primary: null, extensionPrimary: null }
  },
  personDetails: {
    id: 234234234234,
    iqamaNo: 2000000006,
    name: {
      arabic: {
        firstName: 'asd',
        secondName: null,
        thirdName: null,
        familyName: 'asd'
      },
      english: { name: null }
    },
    sex: { english: 'Male', arabic: 'ذكر' }
  }
};

export const saveAdminResponse = {
  message: 'Admin saved Successfully',
  personId: 1035487531
};

export const ownerDetailsData = [
  {
    birthDate: {
      gregorian: new Date('16-07-14996'),
      hijiri: ''
    },
    contactDetail: {
      address: {
        additionalNo: '',
        buildingNo: '',
        city: { english: 'asdasd', arabic: null },
        country: { english: 'Oman', arabic: 'عمان ' },
        detailedAddress: 'asdsd',
        district: '',
        postBox: '',
        postalCode: '',
        streetName: '',
        type: 'OVERSEAS',
        unitNo: ''
      },
      emailId: { primary: '' },
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' }
    },
    id: '412312312312',
    idType: 'GCCID',
    index: null,
    iqamaNo: null,
    isAdmin: true,
    name: {
      arabic: {
        firstName: 'شسيشسي',
        secondName: null,
        thirdName: null,
        familyName: 'شسيشس'
      },
      english: { name: null }
    },
    nationality: { english: 'Kuwait', arabic: 'الكويت' },
    newNin: null,
    passportNo: null,
    sex: { english: 'Male', arabic: 'ذكر' }
  }
];

const documentsData = [
  {
    contentId: 'FEAAPPLVD02001015',
    documentContent: 'JVBERi0xLjcNCiWhs8XXDQoxIDAgb2JqDQo8PC9QYWdlcyAyID',
    fileName: 'testPDf.pdf',
    name: {
      arabic: REGISTRATION_REQUEST_FORM_ARABIC,
      english: REGISTRATION_REQUEST_FORM
    },
    required: true,
    reuse: false,
    sequenceNumber: 1,
    started: false,
    valid: true,
    documentType: null,
    uploaded: true,
    transactionId: '',
    isUploading: false,
    size: 'string',
    isContentOpen: false,
    percentageLoaded: 100,
    icon: 'string',
    businessKey: 1232,
    uploadFailed: false,
    isScanning: false
  },
  {
    contentId: 'FEAAPPLVD02001016',
    documentContent: 'JVBERi0xLjcNCiWhs8XXDQoxIDAgb2JqDQo8PC9QYWdlcyAyID',
    fileName: 'testPDf.pdf',
    name: {
      arabic: REGISTRATION_REQUEST_FORM_ARABIC,
      english: REGISTRATION_REQUEST_FORM
    },
    required: true,
    reuse: false,
    sequenceNumber: 1,
    started: false,
    valid: true,
    documentType: null,
    uploaded: true,
    transactionId: '',
    isUploading: false,
    size: 'string',
    isContentOpen: false,
    percentageLoaded: 100,
    icon: 'string',
    businessKey: 12354,
    uploadFailed: false,
    isScanning: false
  }
];

export const submitDocumentsData = documentsData.map(doc => bindToObject(new DocumentItem(), doc));

export const person_withoutIdentifiers = {
  birthDate: null,
  deathDate: null,
  role: 'Admin',
  maritalStatus: null,
  specialization: null,
  education: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS',
      additionalNo: '',
      buildingNo: '',
      district: '',
      postBox: '',
      postalCode: '',
      streetName: '',
      unitNo: '',
      cityDistrict: null
    },
    emailId: null,
    faxNo: null,
    telephoneNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: undefined,
  name: {
    arabic: {
      firstName: 'asd',
      secondName: 'asd',
      thirdName: 'qeasd',
      familyName: 'asd'
    },
    english: { name: '' }
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};

export const identifiers = {
  id: 215165132153
};

export const person_withGccType = {
  birthDate: null,
  deathDate: null,
  role: 'Admin',
  maritalStatus: null,
  specialization: null,
  education: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS',
      additionalNo: '',
      buildingNo: '',
      district: '',
      postBox: '',
      postalCode: '',
      streetName: '',
      unitNo: '',
      cityDistrict: null
    },
    emailId: null,
    faxNo: null,
    telephoneNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: IdentityTypeEnum.NATIONALID,
      passportNo: null,
      borderNo: 0,
      expiryDate: { gregorian: null, hijiri: '' },
      id: null,
      iqamaNo: null,
      issueDate: { gregorian: null, hijiri: '' },
      newNin: 0,
      oldNin: '',
      oldNinDateOfIssue: { gregorian: null, hijiri: '' },
      oldNinIssueVillage: null,
      setTypeNIN() {},
      setTypeIqama() {},
      setTypePassport() {},
      setTypeNationalId() {},
      setTypeBorder() {}
    }
  ],

  name: {
    arabic: {
      firstName: 'asd',
      secondName: 'asd',
      thirdName: 'qeasd',
      familyName: 'asd'
    },
    english: { name: '' }
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};

export const person_withGcc = {
  birthDate: null,
  deathDate: null,
  role: 'Admin',
  maritalStatus: null,
  specialization: null,
  education: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS',
      additionalNo: '',
      buildingNo: '',
      district: '',
      postBox: '',
      postalCode: '',
      streetName: '',
      unitNo: '',
      cityDistrict: null
    },
    emailId: null,
    faxNo: null,
    telephoneNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: IdentityTypeEnum.NATIONALID,
      passportNo: null,
      borderNo: 0,
      expiryDate: { gregorian: null, hijiri: '' },
      id: 0,
      iqamaNo: null,
      issueDate: { gregorian: null, hijiri: '' },
      newNin: 0,
      oldNin: '',
      oldNinDateOfIssue: { gregorian: null, hijiri: '' },
      oldNinIssueVillage: null,
      setTypeNIN() {},
      setTypeIqama() {},
      setTypePassport() {},
      setTypeNationalId() {},
      setTypeBorder() {}
    }
  ],

  name: {
    arabic: {
      firstName: 'asd',
      secondName: 'asd',
      thirdName: 'qeasd',
      familyName: 'asd'
    },
    english: { name: '' }
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};
export const person_withIqama = {
  birthDate: null,
  deathDate: null,
  role: 'Admin',
  maritalStatus: null,
  specialization: null,
  education: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS',
      additionalNo: '',
      buildingNo: '',
      district: '',
      postBox: '',
      postalCode: '',
      streetName: '',
      unitNo: '',
      cityDistrict: null
    },
    emailId: null,
    faxNo: null,
    telephoneNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: IdentityTypeEnum.IQAMA,
      passportNo: null,
      borderNo: 0,
      expiryDate: { gregorian: null, hijiri: '' },
      id: 0,
      iqamaNo: 1684513,
      issueDate: { gregorian: null, hijiri: '' },
      newNin: 0,
      oldNin: '',
      oldNinDateOfIssue: { gregorian: null, hijiri: '' },
      oldNinIssueVillage: null,
      setTypeNIN() {},
      setTypeIqama() {},
      setTypePassport() {},
      setTypeNationalId() {},
      setTypeBorder() {}
    }
  ],

  name: {
    arabic: {
      firstName: 'asd',
      secondName: 'asd',
      thirdName: 'qeasd',
      familyName: 'asd'
    },
    english: { name: '' }
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};

export const deleteOwnerData = {
  birthDate: {
    gregorian: new Date(GREG_DATE_3),
    hijiri: HIJRI_DATE_3
  },
  deathDate: { gregorian: new Date(), hijiri: null },
  role: 'Owner',
  maritalStatus: null,
  specialization: null,
  education: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  contactDetail: {
    address: {
      city: { arabic: null, english: null },
      country: {
        arabic: 'السعودية ',
        english: NationalityTypeEnum.SAUDI_NATIONAL
      },
      detailedAddress: null,
      type: 'OVERSEAS',
      additionalNo: '',
      buildingNo: '',
      district: '',
      postBox: '',
      postalCode: '',
      streetName: '',
      unitNo: '',
      cityDistrict: null
    },
    emailId: null,
    faxNo: null,
    telephoneNo: null,
    mobileNo: { primary: '234234234', isdCodePrimary: '' }
  },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: '35weera234234as',
      borderNo: 0,
      expiryDate: { gregorian: null, hijiri: '' },
      id: 0,
      iqamaNo: null,
      issueDate: { gregorian: null, hijiri: '' },
      newNin: 0,
      oldNin: '',
      oldNinDateOfIssue: { gregorian: null, hijiri: '' },
      oldNinIssueVillage: null,
      setTypeNIN() {},
      setTypeIqama() {},
      setTypePassport() {},
      setTypeNationalId() {},
      setTypeBorder() {}
    }
  ],

  name: {
    arabic: {
      firstName: 'asd',
      secondName: 'asd',
      thirdName: 'qeasd',
      familyName: 'asd'
    },
    english: { name: '' }
  },
  nationality: { arabic: 'الكويت', english: 'Kuwait' },
  personId: 1035487531,
  sex: { arabic: 'ذكر', english: 'Male' }
};

export const crnData = {
  crn: {
    issueDate: { gregorian: new Date('16-07-1996'), hijiri: '' },
    expiryDate: { gregorian: new Date('16-07-1996'), hijiri: '' },
    number: '423sdf23'
  },
  establishmentType: { english: 'Main', arabic: 'رئيسي ' },
  legalEntity: { english: 'Individual', arabic: 'منشأة فردية' },
  license: {
    expiryDate: { gregorian: null, hijiri: '' },
    issueDate: { gregorian: new Date('16-07-1996'), hijiri: '' },
    issuingAuthorityCode: {
      english: 'Ministry of health',
      arabic: 'وزارة الصحة '
    },
    number: '423sdf23'
  },
  molEstablishmentIds: {
    molEstablishmentId: 1256271,
    molEstablishmentOfficeId: null,
    molOfficeId: 1,
    molunId: null
  },
  recruitmentNo: null
};

export const crnDataWithoutOwner = {
  crn: {
    issueDate: { gregorian: null, hijiri: null },
    number: null
  },
  establishmentType: { english: 'Main1', arabic: 'رئيسي ' },
  legalEntity: {
    english: LegalEntityEnum.GOVERNMENT,
    arabic: ' '
  },
  license: {
    expiryDate: { gregorian: null, hijiri: '' },
    issueDate: { gregorian: new Date('16-07-1997'), hijiri: '' },
    issuingAuthorityCode: {
      english: 'Ministry of healt1h',
      arabic: 'وزارة الصحة '
    },
    number: '423sdf4231223'
  },
  molEstablishmentIds: {
    molEstablishmentId: 1256271322,
    molEstablishmentOfficeId: null,
    molOfficeId: 3,
    molunId: null
  },
  recruitmentNo: null
};

export const saveOwner = {
  index: 0,
  owners: [
    {
      birthDate: {
        gregorian: new Date('16-07-14996'),
        hijiri: ''
      },
      contactDetail: {
        address: {
          additionalNo: '',
          buildingNo: '',
          city: { english: 'asdasd', arabic: null },
          country: { english: 'Oman', arabic: 'عمان ' },
          detailedAddress: 'asdsd',
          district: '',
          postBox: '',
          postalCode: '',
          streetName: '',
          type: 'OVERSEAS',
          unitNo: ''
        },
        emailId: { primary: '' },
        mobileNo: { primary: '234234234', isdCodePrimary: '' },
        telephoneNo: { primary: '', extensionPrimary: '' }
      },
      id: '412312312312',
      idType: 'GCCID',
      index: null,
      iqamaNo: null,
      isAdmin: true,
      name: {
        arabic: {
          firstName: 'شسيشسي',
          secondName: null,
          thirdName: null,
          familyName: 'شسيشس'
        },
        english: { name: null }
      },
      nationality: { english: 'Kuwait', arabic: 'الكويت' },
      newNin: null,
      passportNo: null,
      sex: { english: 'Male', arabic: 'ذكر' }
    }
  ]
};

export const genericDocumentItem: DocumentItem = {
  show: true,
  identifier: undefined,
  documentContent: null,
  name: {
    arabic: REGISTRATION_REQUEST_FORM_ARABIC,
    english: REGISTRATION_REQUEST_FORM
  },
  reuse: false,
  referenceNo: 123456,
  sequenceNumber: 1,
  documentType: 'string',
  uuid: 'string',
  required: false,
  started: true,
  valid: true,
  contentId: 'string',
  fileName: 'string',
  uploaded: true,
  transactionId: '',
  isUploading: false,
  size: 'string',
  isContentOpen: false,
  percentageLoaded: 100,
  icon: 'string',
  businessKey: 123456,
  uploadFailed: false,
  isScanning: false,
  canDelete: true,
  fromJsonToObject: () => {
    return undefined;
  },
  transactionReferenceIds: [],
  documentClassification: undefined,
  userAccessList: []
};

export const documentList = [
  {
    documentContent: null,
    name: {
      arabic: REGISTRATION_REQUEST_FORM_ARABIC,
      english: REGISTRATION_REQUEST_FORM
    },
    required: true,
    reuse: false,
    sequenceNumber: 1,
    contentId: '13513213'
  }
];

const docResponseItems = [
  {
    content: '',
    documentName: '',
    fileName: '',
    id: '234234',
    registrationNumber: '',
    contentId: '',
    name: {
      arabic: 'string',
      english: 'string'
    }
  }
];
export const documentResonseItemListStub = docResponseItems.map(doc => bindToObject(new DocumentResponseItem(), doc));

export const documentItemData = {
  documentContent: null,
  name: {
    arabic: REGISTRATION_REQUEST_FORM_ARABIC,
    english: REGISTRATION_REQUEST_FORM
  },
  reuse: false,
  sequenceNumber: 1,
  documentType: 'string',
  required: false,
  started: true,
  valid: true,
  contentId: 'string',
  fileName: 'string',
  uploaded: true,
  transactionId: '',
  isUploading: false,
  size: 'string',
  isContentOpen: false,
  percentageLoaded: 100,
  icon: 'string',
  businessKey: ' ',
  uploadFailed: false,
  isScanning: false
};

export const documentContent = {
  content: 'string',
  documentName: REGISTRATION_REQUEST_FORM,
  fileName: 'string',
  id: 'string'
};

export const addGccIdData = {
  person: {
    identity: [
      {
        borderNo: 0,
        expiryDate: { gregorian: null, hijiri: '' },
        id: 0,
        idType: 'PASSPORT',
        iqamaNo: null,
        issueDate: { gregorian: null, hijiri: '' },
        newNin: 0,
        oldNin: '',
        oldNinDateOfIssue: { gregorian: null, hijiri: '' },
        oldNinIssueVillage: null,
        passportNo: 'asd234523',
        setTypeNIN() {},
        setTypeIqama() {},
        setTypePassport() {},
        setTypeNationalId() {}
      }
    ],
    nationality: { english: 'Kuwait', arabic: 'الكويت' },
    personId: null,
    birthDate: { gregorian: new Date(), hijiri: null },
    deathDate: { gregorian: new Date(), hijiri: null },
    role: 'Owner',
    maritalStatus: null,
    specialization: null,
    education: null,
    iqama: null,
    passport: null,
    nin: null,
    nationalId: null,
    name: { arabic: 'asd', english: '' },
    sex: { english: 'Male', arabic: '' },
    contactDetail: null
  },
  verifyDetails: {
    birthDate: {
      gregorian: new Date(BIRTHDATE_GREG),
      hijiri: ''
    },
    id: null,
    idType: 'GCCID',
    iqamaNo: null,
    nationality: { english: 'Kuwait', arabic: 'الكويت' },
    newNin: null,
    passportNo: 'asd234523'
  }
};

export const bindIdentifiersData = {
  person: {
    birthDate: {
      gregorian: new Date(BIRTHDATE_GREG),

      hijiri: ''
    },
    contactDetail: {
      address: {
        additionalNo: '',
        buildingNo: '',
        city: { english: 'asdasd', arabic: null },
        country: { english: 'Oman', arabic: 'عمان ' },
        detailedAddress: '',
        district: '',
        postBox: '',
        postalCode: '',
        streetName: '',
        type: 'OVERSEAS',
        unitNo: '',
        cityDistrict: null
      },
      emailId: { primary: '' },
      mobileNo: { primary: '234234234', isdCodePrimary: '' },
      telephoneNo: { primary: '', extensionPrimary: '' },
      faxNo: null
    },
    deathDate: { gregorian: null, hijiri: '' },
    education: { english: null, arabic: null },
    identity: [
      {
        setTypeNIN() {},
        setTypeIqama() {},
        setTypePassport() {},
        setTypeNationalId() {},
        borderNo: 0,
        expiryDate: { gregorian: null, hijiri: '' },
        id: 0,
        idType: 'PASSPORT',
        iqamaNo: null,
        issueDate: { gregorian: null, hijiri: '' },
        newNin: 0,
        oldNin: '',
        oldNinDateOfIssue: { gregorian: null, hijiri: '' },
        oldNinIssueVillage: null,
        passportNo: 'asd234523'
      }
    ],
    maritalStatus: null,
    name: {
      arabic: {
        firstName: 'شسيشسي',
        secondName: null,
        thirdName: null,
        familyName: 'شسيشسي'
      },
      english: { name: null }
    },
    nationality: { english: 'Kuwait', arabic: 'الكويت' },
    role: 'Owner',
    sex: { english: 'Male', arabic: 'ذكر' },
    specialization: { english: null, arabic: null },
    personId: null,
    iqama: null,
    passport: null,
    nin: null,
    nationalId: null
  },
  gccId: 234234234234
};

export const bankPaymentDetails = {
  paymentDetails: {
    paymentType: { arabic: 'لا', english: 'No' },
    bankAccount: {
      ibanAccountNo: '2626266626',
      bankName: { arabic: 'اسم المكتب', english: 'Indian' }
    },
    registrationNo: 307621073,
    startDate: { gregorian: new Date(), hijri: null }
  },
  bankAccount: null
};

export const verifyGCCEstablishmentData = [
  {
    country: { english: 'Bahrain', arabic: 'البحرين ' },
    legalEntity: {
      english: STOCK_SHARE_COMPANY,
      arabic: 'منشأة مساهمة'
    },
    registrationNo: '58iou9552'
  }
];

export const establishmentDetailsTestData = {
  organizationCategory: { english: 'Government', arabic: null },
  gccEstablishment: null,
  establishmentAccount: null,
  proactive: false,
  crn: null,
  molEstablishmentIds: null,
  navigationIndicator: null,
  paymentType: { english: 'MOF', arabic: '' },
  activityType: { english: '', arabic: '' },
  gccCountry: false,
  nationalityCode: {
    english: NationalityTypeEnum.SAUDI_NATIONAL,
    arabic: null
  },
  name: { english: 'test', arabic: 'test' },
  registrationNo: 34564566,
  startDate: {
    gregorian: new Date(),
    hijiri: '1987/01/01'
  },
  villageId: 1001,
  contactDetails: new ContactDetails(),
  status: { english: EstablishmentStatusEnum.CLOSED, arabic: 'test' },
  legalEntity: {
    english: 'Individual',
    arabic: null
  },
  establishmentType: { english: 'Main' },
  license: {
    issueDate: {
      gregorian: new Date()
    },
    issuingAuthorityCode: { english: 'Ministry of Education', arabic: null },
    number: 45621
  },
  outOfMarket: true,
  mainEstablishmentRegNo: 1354,
  recruitmentNo: 452132,
  establishmentAdminDetails: new Admin(),
  scanDocuments: [],
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};
export const mainEstablishment = {
  establishmentType: { english: 'Main', arabic: 'فرع ' },
  legalEntity: { english: 'Government', arabic: 'حكومي' },
  license: {
    issueDate: { gregorian: new Date('2019-07-02T00:00:00.000Z'), hijiri: '' },
    issuingAuthorityCode: {
      english: 'Ministry of External Affairs',
      arabic: 'وزارة الخارجية '
    },
    number: 23324523,
    expiryDate: { gregorian: null, hijiri: '' }
  },
  mainEstablishmentRegNo: 924201479,
  organizationCategory: { english: 'Government', arabic: null },
  gccEstablishment: null,
  establishmentAccount: null,
  crn: null,
  molEstablishmentIds: null,
  navigationIndicator: null,
  paymentType: { english: 'MOF', arabic: '' },
  activityType: { english: '', arabic: '' },
  gccCountry: false,
  nationalityCode: {
    english: NationalityTypeEnum.SAUDI_NATIONAL,
    arabic: null
  },
  registrationNo: 924201479,
  name: {
    arabic: 'asdasd',
    english: null
  },

  proactive: null,
  recruitmentNo: 0,
  startDate: {
    gregorian: new Date('2019-06-01T00:00:00.000Z'),
    hijiri: ''
  },
  contactDetails: {
    villageId: 0,
    emailId: {
      primary: 'asd@asd'
    },
    faxNo: '',
    mobileNo: {
      primary: '',
      isdCodePrimary: ''
    },
    telephoneNo: {
      primary: '123123',
      extensionPrimary: ''
    },
    address: {
      country: { english: null, arabic: null },
      cityDistrict: null,
      city: { english: null, arabic: null },
      postalCode: '12323',
      postBox: '123',
      buildingNo: '',
      district: '',
      detailedAddress: null,
      streetName: '',
      additionalNo: '',
      unitNo: '',
      type: 'POBOX'
    }
  },
  status: { english: EstablishmentStatusEnum.CANCELLED, arabic: 'test' },
  scanDocuments: [],
  transactionReferenceData: []
};

export const establishmentAddressDetailsTestData = {
  type: '1001',
  addressLine: 'rr',
  city: 'asd',
  country: {
    code: 2
  },
  district: 'dd',
  postBox: 123,
  streetName: 'sss',
  postalCode: 'sss',
  additionalNo: 123,
  buildingNo: '123'
};
export const establishmentContactDetailsTestData = {
  emailId: 'asx@gnam',
  extension: '1234567890',
  mobileNo: 1234567890,
  telephoneNo: '1234567890'
};
export const enrollEstablishmentResponseData = {
  id: '1',
  message: 'Sucessfully enrolled the establishemnt',
  registrationNo: 7894561235
};

export const error = {
  message: {
    english: 'Add engagement failed',
    arabic: 'فشل إضافة المشاركة'
  },
  details: [
    {
      english: 'Age should be above 50',
      arabic: 'يجب أن يكون عمر الطفل أقل من 50'
    }
  ]
};

export const establishmentOwnerDetailsTestData = {
  ownerBasicDetails: {
    idType: { code: 1003, description: null },
    nationality: { code: 354 },
    nin: null,
    dateOfBirth: {
      gregorian: new Date(),
      hijiri: '1400-03-27'
    },
    passport: {
      passportNo: '3731012',
      expiryDate: {
        gregorian: new Date(),
        hijiri: HIJRI_DATE
      },
      issueDate: {
        gregorian: new Date(),
        hijiri: HIJRI_DATE
      }
    },
    iqama: {
      iqamaNo: 2087734147,
      expiryDate: {
        gregorian: new Date(),
        hijiri: HIJRI_DATE
      }
    },
    name: {
      arabic: {
        familyName: 'ررثد',
        firstName: 'خثزخ',
        secondName: 'خحذبرث',
        thirdName: 'asd'
      },
      english: { name: 'CBFG CBBBEBB  ABBBAA' }
    },
    sex: { code: 1001, description: 'Male' }
  },
  ownerContactDetails: {
    additionalNo: '',
    type: '1002',
    addressLine: 'asd',
    city: 'asd',
    country: {
      code: 110,
      description: ''
    },
    district: '',
    postBox: '123',
    buildingNo: ' ',
    streetName: '',
    postalCode: '12312',
    emailId: [''],
    extension: [''],
    mobileNo: [''],
    telephoneNo: ['12323']
  }
};

export const genericLicense: License = {
  issueDate: { gregorian: new Date(), hijiri: 'tetsing' },
  expiryDate: { gregorian: new Date(), hijiri: 'tetsing' },
  issuingAuthorityCode: { english: 'testing', arabic: 'testing' },
  number: 123456
};

export const establishmentOwnerAddressDetailsTestData = {
  additionalNo: 'string',
  addressLine: 'string',
  buildingNo: 'string',
  city: 'asd',
  country: {
    code: 0,
    description: 'string'
  },
  district: 'string',
  postBox: 'string',
  streetName: 'string',
  type: 'string',
  postalCode: 'string'
};

export const establishmentOwnerContactDetailsTestData = {
  emailId: [''],
  extension: [''],
  mobileNo: [''],
  telephoneNo: ['12323']
};

export const establishmentOwnerVerifyResponseData = {
  nationality: {
    code: 354
  },
  nin: 1234567,
  passport: {
    passportNo: '3731012'
  },
  iqama: {
    iqamaNo: 2087734147
  },
  name: {
    arabic: {
      firstName: 'خثزخ',
      secondName: 'خحذبرث',
      familyName: 'ررثدر'
    },
    english: {
      name: 'english name'
    }
  },
  sex: {
    code: 1001
  },
  dateOfBirth: {
    gregorian: '1970-01-24T09:00:00.0Z',
    hijiri: '1389-11-18'
  },
  idType: 1001
};

export const changePersonTransactionKey = 'CHANGE_PERSON';
export const changePersonTransactionType = 'NON_SAUDI_IBAN_VERIFICATION';
export const changePersonTransactionIdenifier = 1017666367;

export const genericViolationCountTestData = {
  paidCount: 3,
  total: 6,
  unPaidCount: 3,
  donotImposePenaltyCount: 2
};

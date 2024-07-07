import { Person } from '@gosi-ui/core';
import { bindToObject } from '@gosi-ui/core';
import { ContributorWageDetailsResponse } from '@gosi-ui/features/contributor/lib/shared/models';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
//TODO Move test data to testing folder and if it is already there then use the existing
export const registerationNoData = {
  regNo: 200085744
};

export const requiredDocumentItem = {
  documentContent: null,
  documentType: null,
  name: {
    english: 'Dipin',
    arabic: 'Nipid'
  },
  required: false,
  reuse: false,
  started: false,
  valid: false,
  contentId: null,
  uploaded: false,
  sequenceNumber: 0,
  isUploading: false,
  size: null,
  isContentOpen: false,
  percentageLoaded: 0,
  icon: null,
  businessKey: null,
  transactionId: null,
  uploadFailed: false,
  isScanning: false,
  fileName: 'test'
};

export const documentListItemArray = [
  {
    documentContent: 'jhfjhfjhfjhfjf',
    documentType: null,
    name: {
      english: 'Dipin',
      arabic: 'Nipid'
    },
    required: false,
    reuse: false,
    started: false,
    valid: false,
    contentId: null,
    uploaded: false,
    sequenceNumber: 0,
    isUploading: false,
    size: null,
    isContentOpen: false,
    percentageLoaded: 0,
    icon: null,
    businessKey: null,
    transactionId: null,
    uploadFailed: false,
    isScanning: false,
    fileName: 'test'
  },
  {
    documentContent: 'jhkjhkh',
    documentType: null,
    name: {
      english: 'Dipin',
      arabic: 'Nipid'
    },
    required: false,
    reuse: false,
    started: false,
    valid: false,
    contentId: null,
    uploaded: false,
    sequenceNumber: 0,
    isUploading: false,
    size: null,
    isContentOpen: false,
    percentageLoaded: 0,
    icon: null,
    businessKey: null,
    transactionId: null,
    uploadFailed: false,
    isScanning: false,
    fileName: 'test'
  }
];

export const documentResonseItem = {
  content: 'dfsvsdfgv',
  documentName: 'passport',
  fileName: 'dfsdf',
  id: '123',
  contentId: 'string',
  registrationNumber: '524512312'
};

export const uploadSubmitResponseData = {
  referenceNo: 10460
};

export const requiredDocumentDataScenario2 = [
  {
    required: true,
    name: {
      arabic: 'عقد العمل',
      english: 'Employment Contract'
    },
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    contentId: null,
    documentType: null,
    started: false,
    uploaded: false,
    valid: false
  },
  {
    required: true,
    name: {
      arabic: 'بطاقة الهوية الوطنية',
      english: 'National ID'
    },
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    contentId: null,
    documentType: null,
    started: false,
    uploaded: false,
    valid: false
  }
];

export const establishmentDetailsData = {
  registrationNo: 200085744,
  name: {
    arabic: 'دححز ارذ خزخبححخزثخ ححارحث/خرخراةحدخرة',
    english: null
  },
  legalEntity: {
    arabic: 'حكومي',
    english: 'Government'
  },
  organizationCategory: {
    arabic: 'غير حكومي',
    english: 'Non-Government'
  },
  nationalityCode: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  recruitmentNo: null,
  mainEstablishmentRegNo: 200085744,
  activityType: {
    arabic: 'تجارة التجزئة الاخرى ',
    english: 'Activity 6.3.19'
  },
  status: 'REGISTERED',
  gccCountry: false,
  crn: {
    number: 2050035032,
    issueDate: null
  },
  license: null,
  startDate: {
    gregorian: '2002-09-08',
    hijiri: '1423-07-01'
  },
  contactDetails: {
    address: {
      type: 'POBOX',
      country: {
        arabic: 'السعودية ',
        english: 'Saudi Arabia -- '
      },
      city: {
        arabic: 'الدمام',
        english: 'Dammam'
      },
      postalCode: '31413',
      postBox: '9399',
      cityDistrict: null
      // type:'POBOX'
    },
    emailId: {
      primary: 'noreply@gosi.gov.sa'
    },
    telephoneNo: {
      primary: '0663038',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: null,
      secondary: null
    },
    faxNo: null
  },
  scanDocuments: null,
  transactionReferenceData: null,
  comments: null,
  transactionMessage: null,
  establishmentType: {
    arabic: 'رئيسي ',
    english: 'Main'
  },
  proactive: false,
  establishmentAccount: {
    paymentType: null,
    startDate: null,
    bankAccount: null
  },
  molEstablishmentIds: null,
  gccEstablishment: null
};

const PersonalInformation = bindToObject(new Person(), {
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'جاسم',
      thirdName: 'محمد',
      familyName: 'الخميس'
    },
    english: {
      name: 'STRING SRING'
    }
  },
  personType: '',
  fullName: 'Dipin Joseph',
  id: 0,
  specialization: { english: 'India', arabic: 'india' },
  nationality: { english: 'India', arabic: 'india' },
  sex: { english: 'India', arabic: 'india' },
  maritalStatus: { english: 'India', arabic: 'india' },
  birthDate: {
    gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
    hijiri: '1400-03-27'
  },
  deathDate: {
    gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
    hijiri: '1400-03-27'
  },
  education: { english: 'India', arabic: 'india' },
  borderNo: 0,
  govtEmp: false,
  passport: {
    passportNo: '3731012',
    expiryDate: {
      gregorian: new Date(),
      hijiri: '1430-05-10'
    },
    issueDate: {
      gregorian: new Date(),
      hijiri: '1430-05-10'
    }
  },

  identity: [
    {
      idType: 'NIN',
      passportNo: '3731012',
      borderNo: 0,
      expiryDate: { gregorian: null, hijiri: '' },
      id: null,
      iqamaNo: '3731012',
      issueDate: { gregorian: null, hijiri: '' },
      newNin: 1064242157,
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
  contactDetail: {
    emailId: {
      primary: 'ss@gmail.com',
      secondary: ' '
    },
    mobileNo: {
      primary: '124536978',
      secondary: ' ',
      isdCodePrimary: ' ',
      isdCodeSecondary: ' '
    },
    telephoneNo: {
      extensionPrimary: 'string',
      extensionSecondary: 'string',
      primary: 'string',
      secondary: 'string'
    },
    faxNo: '12345',

    addresses: [
      {
        country: { english: 'India', arabic: 'india' },
        city: { english: 'India', arabic: 'india' },
        postalCode: 'test',
        postBox: 'test',
        buildingNo: 'test',
        district: 'test',
        cityDistrict: 'String',
        streetName: 'test',
        type: 'POBOX',
        additionalNo: '123',
        unitNo: '54653',
        detailedAddress: ' '
      }
    ]
  },
  lifeStatus: 'Alive'
});

export const transactionTestData = {
  person: PersonalInformation,
  contributorType: 'SAUDI'
};
export const saveContributorTestData = {
  addressDetails: [
    {
      country: { english: 'India', arabic: 'india' },
      city: { english: 'India', arabic: 'india' },
      postalCode: 'test',
      postBox: 'test',
      buildingNo: 'test',
      district: 'test',
      cityDistrict: 'String',
      streetName: 'test',
      type: 'POBOX',
      additionalNo: '123',
      unitNo: '54653',
      detailedAddress: ' '
    }
  ],
  contactDetails: [
    {
      emailId: {
        primary: 'ss@gmail.com',
        secondary: ' '
      },
      mobileNo: {
        primary: '124536978',
        secondary: ' '
      },
      telephoneNo: {
        extensionPrimary: 'string',
        extensionSecondary: 'string',
        primary: 'string',
        secondary: 'string'
      },
      faxNo: '12345'
    }
  ],
  personalDetails: {
    name: {
      arabic: {
        firstName: 'محمد',
        secondName: 'جاسم',
        thirdName: 'محمد',
        familyName: 'الخميس'
      },
      english: {
        name: 'STRING SRING'
      }
    },
    personType: '',
    fullName: 'Dipin Joseph',
    id: 0,
    specialization: { english: 'India', arabic: 'india' },
    nationality: { english: 'India', arabic: 'india' },
    sex: { english: 'India', arabic: 'india' },
    maritalStatus: { english: 'India', arabic: 'india' },
    birthDate: {
      gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
      hijiri: '1400-03-27'
    },
    deathDate: {
      gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
      hijiri: '1400-03-27'
    },
    education: { english: 'India', arabic: 'india' },
    borderNo: 0,
    passport: {
      passportNo: '3731012',
      expiryDate: {
        gregorian: new Date(),
        hijiri: '1430-05-10'
      },
      issueDate: {
        gregorian: new Date(),
        hijiri: '1430-05-10'
      }
    },

    identity: [
      {
        idType: 'NIN',
        newNin: '1064242157'
      }
    ]
  }
};

export const contactData = {
  additionalNumber: '1234',
  addressLine1: 'Al Janadriyah Suite-7',
  area: 'Olaya Street',
  careOf: 'Test',
  city: 'Riyadh',
  country: 1,
  currentMailingAddrInd: 1,
  emailId: 'ranjithpv10@gmail.com',
  extension: '1234',
  faxNumber: '12345',
  mobileNumber: '9947299886',
  parentPhoneNumber: '9947299886',
  postBox: 'Riyadh',
  postNumber: '670571',
  street: 'Olaya Street',
  telephoneNumber: '048412345',
  unitNo: 1,
  villageId: 0,
  zipCode: '785467'
};

export const engagementSuccessResponseData = {
  companyWorkerNumber: '',
  contributorAbroad: true,
  joiningDate: { gregorian: new Date('01-01-1996'), hijiri: '' },
  prisoner: false,
  student: false,
  workType: {
    english: 'Part Time',
    arabic: 'دوام جزئي'
  },
  engagementPeriod: [
    {
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      contributorAbroad: true,
      occupation: { english: 'Teacher', arabic: 'Teacher' },
      wage: {
        basicWage: 123,
        commission: 123,
        housingBenefit: 123,
        otherAllowance: 123,
        totalWage: 123,
        contributoryWage: 123
      }
    }
  ]
};

export const engagementTestData1 = {
  companyWorkerNumber: '',
  contributorAbroad: { english: 'No' },
  isContributorActive: true,
  joiningDate: { gregorian: new Date('01-01-1996'), hijiri: '' },
  leavingDate: { gregorian: new Date('01-01-2015'), hijiri: '' },
  prisoner: false,
  student: false,
  workType: {
    english: 'Part Time',
    arabic: 'دوام جزئي'
  },
  scanDocuments: null,
  engagementPeriod: [
    {
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      minDate: new Date(),
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      contributorAbroad: false,
      occupation: { english: 'Teacher', arabic: 'Teacher' },
      wage: {
        basicWage: 123,
        commission: 123,
        housingBenefit: 123,
        otherAllowance: 123,
        totalWage: 123,
        contributoryWage: 123
      }
    }
  ]
};

export const engagementTestData2 = {
  joiningDate: {
    gregorian: new Date('2019-06-01T00:00:00.000Z'),
    hijiri: '1400-03-27'
  },
  companyWorkerNumber: '11111',
  contributorAbroad: 'Yes',
  workType: 'test',
  occupationDetail: [
    {
      occupation: { english: 'Teacher', arabic: 'Teacher' },
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      }
    }
  ],
  wageDetail: [
    {
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      contributorAbroad: true,
      occupation: { english: 'Teacher', arabic: 'Teacher' },
      wage: {
        basicWage: 123,
        commission: 123,
        housingBenefit: 123,
        otherAllowance: 123,
        totalWage: 123,
        contributoryWage: 123
      }
    }
  ],
  student: false,
  prisoner: false
};

export const engagementSaveTestData = {
  employmentDetails: {
    checkBoxFlag: true,
    companyWorkerNumber: null,
    contributorAbroad: null,
    isContributorActive: true,
    joiningDate: {
      gregorian: new Date('01-01-2011'),
      hijiri: ' '
    },
    occupationDetail: ' ',
    prisoner: false,
    student: false,
    workType: {
      english: 'Part Time',
      arabic: 'دوام جزئي'
    }
  },
  employmentWageDetail: {
    wageDetails: [
      {
        basicWage: '3000.00',
        commission: '0.00',
        coverage: ' ',
        endDate: {
          gregorian: new Date(),
          hijiri: ' '
        },
        housingBenefit: '0.00',
        occupation: {
          english: 'Mechanical Physicist',
          arabic: 'فيزيائي ميكانيكا'
        },
        otherAllowance: '0.00',
        startDate: {
          gregorian: new Date(),
          hijiri: ''
        },
        contributorAbroad: true,
        totalWage: '3000.00'
      }
    ]
  }
};

export const engagementSaveServiceTestData = {
  employmentDetails: {
    checkBoxFlag: true,
    companyWorkerNumber: null,
    contributorAbroad: {
      english: 'Yes',
      arabic: 'نعم'
    },
    joiningDate: {
      gregorian: new Date('01-01-2011'),
      hijiri: ' '
    },
    occupationDetail: ' ',
    prisoner: false,
    student: false,
    workType: {
      english: 'Part Time',
      arabic: 'دوام جزئي'
    }
  },
  employmentWageDetails: {
    wageDetails: [
      {
        basicWage: '3000.00',
        commission: '0.00',
        coverage: ' ',
        endDate: {
          gregorian: new Date(),
          hijiri: ' '
        },
        housingBenefit: '0.00',
        occupation: {
          english: 'Mechanical Physicist',
          arabic: 'فيزيائي ميكانيكا'
        },
        otherAllowance: '0.00',
        startDate: {
          gregorian: new Date(),
          hijiri: ''
        },
        contributorAbroad: true,
        totalWage: '3000.00'
      }
    ],
    engagementPeriod: [
      {
        startDate: {
          gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
          hijiri: '1400-03-27'
        },
        endDate: {
          gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
          hijiri: '1400-03-27'
        },
        contributorAbroad: true,
        occupation: { english: 'Teacher', arabic: 'Teacher' },
        wage: {
          basicWage: 123,
          commission: 123,
          housingBenefit: 123,
          otherAllowance: 123,
          totalWage: 123,
          contributoryWage: 123
        }
      }
    ]
  }
};

export const engagementSuccessResponse = {
  id: 102,
  message: {
    english: 'Add engagement Sucess',
    arabic: 'فشل إضافة المشاركة'
  }
};
/*
export const enrollContributorResponseData = {
  id: 1,
  message: 'Sucessfully enrolled the contributor'
};
export const enrollEngagementResponseData = {
  id: 1,
  message: 'Sucessfully enrolled the engagement'
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
export const enrolContributorError = {
  error: {
    message: {
      english: 'Add contributor failed',
      arabic: 'فشل إضافة المشاركة'
    }
  }
};
export const enrollEngagementError = {
  error: {
    message: {
      english: 'Add engagement failed',
      arabic: 'فشل إضافة المشاركة'
    }
  }
};
 */
export const searchNinResponse = {
  id: '0',
  status: 0
};
export const coverageRequestData = {
  coverageDetail: [
    {
      coverage: 1006,
      coverageType: {
        arabic: 'معاشات وتعطل',
        english: 'Annuity&Unemployment'
      }
    },
    {
      coverage: 1007,
      coverageType: {
        arabic: 'معاشات وأخطار وتعطل',
        english: 'Annuity&OH&Unemployment'
      }
    }
  ]
};
export const maxWageRequestData = {
  socialInsuranceNo: 123456,
  registrationNo: 123456
};

export const maxWageResponseData = {
  maximumWage: 45000,
  eligibleJoiningDate: {
    gregorian: new Date(),
    hijri: null
  }
};
export const getContributorData = {
  person: PersonalInformation,
  contributorType: 'SAUDI',
  registrationNo: 10011213,
  socialInsuranceNo: 413298745,
  mergedSocialInsuranceNo: 21312312,
  mergerStatus: 'true'
};
export const saveContributorResponse = {
  person: PersonalInformation,
  contributorType: 'SAUDI',
  registrationNo: 10011213,
  socialInsuranceNo: 413298745
};
export const cancelEngagmentResponse = {
  referenceNo: 413298745
};

export const saveContributorAPIResponse = {
  approvalStatus: 'success',
  socialInsuranceNo: 123456899
};

export const contributorWageResponseData = bindToObject(new ContributorWageDetailsResponse(), {
  contributors: [
    {
      anyPendingRequest: false,
      engagementId: 1570880582,
      govtEmp: true,
      identity: [],
      joiningDate: {
        gregorian: new Date(2020, 11, 4, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      name: {
        arabic: 'string',
        english: 'string'
      },
      nationality: { arabic: 'قبائل نازحة', english: 'Immigrated Tribes' },
      proactive: false,
      socialInsuranceNo: 423969822,
      transactionRefNo: 0,
      deathDate: {
        gregorian: new Date(2020, 11, 4, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      }
    }
  ],
  pageNo: 0,
  pageSize: 10,
  numberOfContributors: 1
});
export const contributorResponseDeathData = bindToObject(new ContributorWageDetailsResponse(), {
  contributors: [
    {
      anyPendingRequest: false,
      engagementId: 1570880582,
      govtEmp: true,
      identity: [],
      joiningDate: {
        gregorian: new Date(2020, 11, 4, 10, 33, 30, 0),
        hijiri: '1400-03-27'
      },
      name: {
        arabic: 'string',
        english: 'string'
      },
      nationality: { arabic: 'قبائل نازحة', english: 'Immigrated Tribes' },
      proactive: false,
      socialInsuranceNo: 423969822,
      transactionRefNo: 0
    }
  ],
  pageNo: 0,
  pageSize: 10,
  numberOfContributors: 1
});

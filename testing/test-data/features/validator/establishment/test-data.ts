/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const getEstablishmentRequest = {
  registrationNo: 593277929
};

//Test Data For NgOnint

export const taskIdParam1 = 'cf301ea8-7e7f-4bd4-91de-1af36e0308dd';
export const validatorParam1 = 2;
export const registrationNo1 = 593277929;

export const verifyAdminErrorResponse1 = {
  error: {
    code: 'PM-ERR-0013',
    message: {
      english: 'No owner',
      arabic: 'No owner1'
    }
  }
};
export const deleteOwnerrResponse = {
  registrationNo: 1234567890,
  personId: 1035487531
};

export const bankResponse = {
  items: [],
  value: { english: 'ibc', arabic: 'adfad' },
  sequence: 1
};

export const getEstablishment1Response = {
  organizationCategory: null,
  registrationNo: 593277929,
  name: { arabic: 'شبشسيبشسيب', english: null },
  legalEntity: {
    arabic: 'منظمة/ هيئة إقليمية أو دولية',
    english: 'Organization regional or international'
  },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  recruitmentNo: 0,
  mainEstablishmentRegNo: 593277929,
  activityType: {
    arabic: 'أنشطة الإذاعة والتليفزيون ',
    english: 'Activity 9.6.10'
  },
  status: 'Opening in progress',
  gccCountry: false,
  crn: null,
  license: {
    number: 513513454,
    issuingAuthorityCode: {
      arabic: 'وزارة التربية والتعليم ',
      english: 'Ministry of Education'
    },
    issueDate: { gregorian: new Date() },
    expiryDate: null
  },
  startDate: { gregorian: new Date(), hijiri: '1440-11-29' },
  contactDetails: {
    address: {
      buildingNo: null,
      district: null,
      streetName: null,
      additionalNo: null,
      unitNo: null,
      detailedAddress: null,
      type: 'POBOX',
      country: { arabic: 'السعودية ', english: 'Saudi Arabia' },
      city: { arabic: 'سليلة جهينة', english: 'Slelat Johainah' },
      postalCode: '52452',
      postBox: '4524524524',
      cityDistrict: null
    },
    emailId: null,
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '524524525',
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null
    },
    faxNo: null
  },
  scanDocuments: [
    {
      contentId: 'FEAAPPLVD02001268',
      type: {
        arabic: 'نموذج تفويض مشرف المنشأة',
        english: 'Admin Authorization Letter'
      },
      sequenceNumber: 0
    },
    {
      contentId: 'FEAAPPLVD02001267',
      type: { arabic: 'الترخيص', english: 'License' },
      sequenceNumber: 1
    },
    {
      contentId: 'FEAAPPLVD02001266',
      type: {
        arabic: 'نموذج طلب التسجيل',
        english: 'Registration Request Form or Letter'
      },
      sequenceNumber: 2
    }
  ],
  transactionReferenceData: [
    {
      referenceNo: 12354,
      createdDate: {
        gregorian: new Date(),
        hijiri: ''
      },
      transactionType: 'string',
      comments: 'string',
      rejectionReason: {
        english: '',
        arabic: ''
      },
      role: {
        english: '',
        arabic: ''
      },
      userName: {
        english: '',
        arabic: ''
      }
    }
  ],
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  proactive: false,
  establishmentAccount: {
    registrationNo: 46541321,
    paymentType: { arabic: 'نعم', english: 'Yes' },
    startDate: { gregorian: new Date('2019-08-01'), hijiri: '1440-11-29' },
    bankAccount: null
  },
  molEstablishmentIds: null,
  gccEstablishment: null,
  navigationIndicator: null,
  molRecordId: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};

export const ownerResponse = {
  birthDate: {
    gregorian: new Date(),
    hijiri: ''
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
        english: 'Saudi'
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
    mobileNo: {
      primary: '234234347',
      isdCodePrimary: 'sa',
      isdCodeSecondary: null,
      secondary: null
    }
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

export const systemParameterData = [
  { name: 'MAX_BACKDATED_JOINING_DATE', value: '2018-04-01' },
  { name: 'MAX_REGULAR_JOINING_DATE', value: '2020-04-01' }
];

export const rejectionReasonListData = {
  items: [
    {
      code: 1001,
      sequence: 1,
      value: { arabic: 'وثيقة خاطئة', english: 'Wrong document' }
    },
    {
      code: 1002,
      sequence: 1,
      value: { arabic: 'وثيقة مفقودة', english: 'Missing document' }
    },
    {
      code: 1006,
      sequence: 1,
      value: { arabic: 'الآخرين', english: 'Others' }
    }
  ]
};
export const collectionReturnListData = {
  items: [
    {
      code: 1001,
      sequence: 1,
      value: { arabic: 'وثيقة خاطئة', english: 'Wrong document' }
    },
    {
      code: 1002,
      sequence: 1,
      value: { arabic: 'وثيقة مفقودة', english: 'Missing document' }
    },
    {
      code: 1006,
      sequence: 1,
      value: { arabic: 'الآخرين', english: 'Others' }
    }
  ]
};
export const contributionSortListData = {
  items: [
    {
      sequence: 1,
      code: 1,
      value: {
        arabic: 'اسم المشترك',
        english: 'Contributor Name'
      }
    },
    {
      sequence: 2,
      code: 2,
      value: {
        arabic: 'الأجر الخاضع للاشتراك',
        english: 'Contributory Wage'
      }
    },
    {
      sequence: 3,
      code: 3,
      value: {
        arabic: 'المبلغ الإجمالي',
        english: 'Total Amount'
      }
    }
  ]
};
export const receiptSortListData = {
  items: [
    {
      sequence: 1,
      code: 1,
      value: {
        arabic: 'اسم المشترك',
        english: 'Receipt Date'
      }
    },
    {
      sequence: 2,
      code: 2,
      value: {
        arabic: 'الأجر الخاضع للاشتراك',
        english: 'Amoun Received'
      }
    },
    {
      sequence: 3,
      code: 3,
      value: {
        arabic: 'المبلغ الإجمالي',
        english: 'Receipt Number'
      }
    }
  ]
};
export const adjustmentSortListData = {
  items: [
    {
      sequence: 1,
      code: 1,
      value: {
        arabic: 'اسم المشترك',
        english: 'Adjustment Date'
      }
    },
    {
      sequence: 2,
      code: 2,
      value: {
        arabic: 'الأجر الخاضع للاشتراك',
        english: 'Late Fees'
      }
    },
    {
      sequence: 3,
      code: 3,
      value: {
        arabic: 'المبلغ الإجمالي',
        english: 'Total Amount'
      }
    }
  ]
};

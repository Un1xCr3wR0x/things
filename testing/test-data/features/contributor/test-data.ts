import { ValidatorRoles, EngagementDetails } from '@gosi-ui/features/contributor';
import { Person, bindToObject } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const PersonInformation = bindToObject(new Person(), {
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
  personType: 'GCC',
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
  lifeStatus: 'Alive',
  socialInsuranceNumber: []
});

export const contributorData = {
  person: PersonInformation,
  type: 'SAUDI',
  active: false,
  contributorType: 'saudi',
  socialInsuranceNo: 423659266,
  vicIndicator: false,
  statusType: 'INACTIVE',
  fromJsonToObject: () => {
    return undefined;
  }
};
export const establishmentApproveTestData = {
  taskId: '0awesdaf213-asd546-asdasd5623-asdasd',
  registrationNo: 10101010,
  status: 'APPROVE'
};

export const establishmentRejectionTestData = {
  rejectionReason: 'Not eligible',
  comments: 'Salary is less than the minimum wage',
  registrationNo: 10101010,
  status: 'REJECT',
  taskId: '0awesdaf213-asd546-asdasd5623-asdasd'
};
const engagementRes = {
  joiningDate: {
    gregorian: '2019-03-12',
    hijiri: '1440-07-05'
  },
  prisoner: false,
  student: false,
  contributorAbroad: true,
  companyWorkerNumber: '2341234',
  workType: {
    arabic: 'دوام جزئي',
    english: 'Part Time'
  },
  engagementPeriod: [
    {
      occupation: {
        arabic: 'اختصاصي ماكياج',
        english: 'Make-up specialist'
      },
      startDate: {
        gregorian: '2019-03-12',
        hijiri: '1440-07-05'
      },
      endDate: {
        gregorian: '2019-07-31',
        hijiri: '1440-11-28'
      },
      contributorAbroad: true,
      coverageType: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      wage: {
        basicWage: 234124,
        housingBenefit: 324234,
        commission: 0,
        otherAllowance: 0,
        totalWage: 558358,
        contributoryWage: 45000
      }
    }
  ],
  proactive: false,
  backdatingIndicator: true,
  penaltyIndicator: true,
  status: 'PENDING',
  transactionReferenceData: [
    {
      transactionType: 'Register Contributor',
      referenceNo: 10276,
      rejectionReason: null,
      comments: null,
      createdDate: {
        gregorian: '2019-09-17',
        hijiri: '1441-01-17'
      },
      userName: {
        arabic: 'سابين',
        english: 'Sabin'
      },
      role: {
        arabic: 'المدقق الأول',
        english: 'First Validator'
      },
      returnReason: null
    }
  ],
  scanDocuments: [
    {
      contentId: 'FEAAPPLVD04001707',
      type: {
        arabic: 'تسلسل الأجور',
        english: 'Pay Slip Sequence'
      },
      sequenceNumber: 0
    },
    {
      contentId: 'FEAAPPLVD04001706',
      type: {
        arabic: 'قرار التعيين أو عقد العمل',
        english: 'Letter of appointment or Employment Contract'
      },
      sequenceNumber: 1
    },
    {
      contentId: 'FEAAPPLVD04001705',
      type: {
        arabic: 'إثبات تاريخ المباشرة',
        english: 'Proof of job starting date'
      },
      sequenceNumber: 2
    },
    {
      contentId: 'FEAAPPLVD04001704',
      type: {
        arabic: 'أخرى',
        english: 'Other'
      },
      sequenceNumber: 3
    }
  ]
};
export const engagement = bindToObject(new EngagementDetails(), engagementRes);

export const engagmentResponce = engagementRes;

export const establishmentResponseTestData = {
  name: {
    arabic: 'دححز ارذ خزخبححخزثخ ححارحث/خرخراةحدخرة',
    english: 'ABC'
  }
};
export const engagmentResponseTestData = {
  name: {
    backdatingIndicator: true,
    contributorAbroad: false
  }
};
export const transactionApproveResponse = {
  name: {
    arabic: 'تم اعتماد المعاملة.',
    english: 'Transaction is approved.'
  }
};

export const transactionReturnResponse = {
  name: {
    arabic: 'لة إرجاع المعاملة.',
    english: 'Transaction is returned.'
  }
};

export const transactionRejectResponse = {
  name: {
    arabic: 'تم رفض المعاملة.',
    english: 'Transaction is rejected.'
  }
};

export const systemParameterResponseData = [
  {
    name: 'MAX_BACKDATE_PERIOD_IN_MONTHS',
    value: '24'
  },
  {
    name: 'PRIVATE_ESTABLISHMENT_START_DATE',
    value: '1973-02-04'
  },
  {
    name: 'GOVERNMENT_ESTABLISHMENT_START_DATE',
    value: '1973-10-28'
  },
  {
    name: 'SEMI_GOVERNMENT_ESTABLISHMENT_START_DATE',
    value: '1973-06-02'
  },
  {
    name: 'GCC_ESTABLISHMENT_START_DATE',
    value: '2006-01-01'
  },
  {
    name: 'GCC_ESTABLISHMENT_START_DATE_FOR_QATAR_UAE',
    value: '2007-01-01'
  },
  {
    name: 'MAX_NO_OF_OWNER_FOR_ESTABLISHMENT',
    value: '5'
  },
  {
    name: 'MAX_REGULAR_PERIOD_IN_MONTHS',
    value: '0'
  },
  {
    name: 'NIC_INTEGRATED',
    value: '1'
  },
  {
    name: 'MAX_VERIFICATION_DATE',
    value: '1'
  },
  {
    name: 'CALL_CENTER_NUMBER',
    value: '8001243344'
  },
  {
    name: 'VIEW_ESTABLISHMENT_BILL',
    value: 'home/billing/establishment'
  },
  {
    name: 'SADAD_PAYMENT_LINK',
    value: 'sadadPayment'
  },
  {
    name: 'GOSI_GCC_UNIT_EMAIL',
    value: 'gov@gosi.gov.sa'
  },
  {
    name: 'VIEW_CONTRIBUTOR_BILL',
    value: 'establishment-public/#/home/billing/contributor'
  },
  {
    name: 'MAX_BACKDATED_JOINING_DATE',
    value: '2018-02-01'
  },
  {
    name: 'MAX_REGULAR_JOINING_DATE',
    value: '2020-02-01'
  },
  {
    name: 'BILL_BATCH_INDICATOR',
    value: '1'
  }
];

export const vicContributorResponseData = {
  socialInsuranceNo: 423975172,
  vicIndicator: false,
  person: {
    personId: 1037303911,
    nationality: {
      arabic: 'السعودية',
      english: 'Saudi Arabia'
    },
    identity: [
      {
        idType: 'NIN',
        newNin: 1866985664,
        oldNin: null,
        oldNinDateOfIssue: null,
        oldNinIssueVillage: null,
        expiryDate: null
      }
    ],
    name: {
      arabic: {
        firstName: 'الجمعان',
        secondName: 'الجمعان',
        thirdName: 'احمد',
        familyName: 'احمد'
      },
      english: {
        name: 'Meher Samad Abdullah Mohammed'
      }
    },
    sex: {
      arabic: 'انثى',
      english: 'Female'
    },
    education: {
      arabic: 'بكالوريس',
      english: 'Bachelor'
    },
    specialization: {
      arabic: 'العلوم الإدارية',
      english: 'العلوم الإدارية'
    },
    birthDate: {
      gregorian: '1990-06-16T00:00:00.000Z',
      hijiri: 1410 - 11 - 23
    },
    maritalStatus: {
      arabic: null,
      english: 'Unavailable'
    },
    contactDetail: {
      addresses: [
        {
          type: 'NATIONAL',
          city: {
            arabic: 'الرياض',
            english: 'Riyadh'
          },
          buildingNo: 5555,
          postalCode: 55555,
          district: 'Riyadh',
          streetName: 'Riyadh',
          additionalNo: 5255,
          unitNo: null,
          cityDistrict: {
            arabic: 'الرياض',
            english: 'District0101'
          }
        }
      ],
      emailId: null,
      telephoneNo: {
        primary: null,
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null
      },
      mobileNo: {
        primary: 122555555,
        secondary: null,
        isdCodePrimary: 'sa',
        isdCodeSecondary: null
      },
      faxNo: null,
      currentMailingAddress: 'NATIONAL',
      createdBy: 9914070,
      createdDate: {
        gregorian: '2020-11-24T07:08:12.000Z',
        hijiri: '1442-04-09'
      },
      lastModifiedBy: 9914070,
      lastModifiedDate: {
        gregorian: '2020-11-24T07:08:12.000Z',
        hijiri: '1442-04-09'
      },
      mobileNoVerified: false
    },
    userPreferences: {
      commPreferences: 'Ar',
      contactPreferences: null
    },
    prisoner: false,
    student: false,
    govtEmp: false,
    personType: 'Saudi_Person',
    createdBy: 9914070,
    lastModifiedBy: 9914070,
    lastModifiedDate: {
      gregorian: '2020-11-24T07:08:12.000Z',
      hijiri: '1442-04-09'
    }
  },
  hasActiveWorkFlow: false,
  contributorType: 'VIC',
  hasActiveTerminatedOrCancelled: false,
  active: false
};

export const validatorEngagementRequest = {
  user: 'mahesh',
  taskId: '1234',
  registrationNo: 13123,
  socialInsuranceNo: 135689,
  engagementId: 4568915,
  penaltyIndicator: 1,
  assignedRole: ValidatorRoles.VALIDATOR_ONE,
  outcome: 'APPROVE',
  engagementAction: 'VAPPROVE',
  workflowType: 'MANAGE_WAGE'
};

export const contributorGovtInfo = {
  anyPendingRequest: false,
  type: 'SAUDI',
  govtEmp: true,
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
  nationality: {
    arabic: 'قبائل نازحة',
    english: 'Immigrated Tribes'
  }
};

export const contributorDeathInfo = {
  anyPendingRequest: false,
  type: 'SAUDI',
  deathDate: {
    gregorian: '2013-12-02T00:00:00.000Z',
    hijiri: '1435-01-29'
  },
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
  nationality: {
    arabic: 'قبائل نازحة',
    english: 'Immigrated Tribes'
  }
};

export const cancelContributorData = {
  editFlow: true,
  cancellationReason: {
    arabic: 'Wrong Registration ',
    english: 'Wrong Registration'
  },
  uuid: 'string',
  comments: 'string'
};

export const vicEngagementData = {
  purposeOfRegistration: {
    english: 'Professional',
    arabic: 'صاحب مهنة '
  },
  engagementPeriod: {
    occupation: {
      arabic: 'اختصاصي في أعمال الوقاية من الحريق',
      english: 'Fire prevention specialist'
    },
    startDate: { gregorian: new Date(), hijiri: '1440-11-29' },
    basicWage: 19000,
    contributionAmount: 10,
    wageCategory: 10,
    coverageTypes: [
      {
        arabic: 'معاشات',
        english: 'Annuity'
      }
    ],
    editFlow: true,
    status: 'Valid',
    isCurrentPeriod: true
  },
  hasActiveFutureWageAvailable: false
};

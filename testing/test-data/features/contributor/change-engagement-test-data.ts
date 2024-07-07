const engagementPeriod = [
  {
    occupation: {
      arabic: 'الفيزيائيون',
      english: 'Physicists'
    },
    startDate: {
      gregorian: '2020-02-05T03:00:00.000Z',
      hijiri: '1441-06-11'
    },
    endDate: {
      gregorian: '2020-02-29T03:00:00.000Z',
      hijiri: '1441-07-05'
    },
    coverageType: [
      {
        arabic: 'معاشات',
        english: 'Annuity'
      }
    ],
    wage: {
      basicWage: 4250.35,
      housingBenefit: 125.5,
      commission: 125.5,
      otherAllowance: 500,
      totalWage: 5001.35,
      contributoryWage: 2250.1687
    },
    update: false
  },
  {
    occupation: {
      arabic: 'الفيزيائيون',
      english: 'Physicists'
    },
    startDate: {
      gregorian: '2020-03-01T03:00:00.000Z',
      hijiri: '1441-07-06'
    },
    coverageType: [
      {
        arabic: 'معاشات',
        english: 'Annuity'
      },
      {
        arabic: 'أخطار',
        english: 'Occupational Hazard'
      }
    ],
    wage: {
      basicWage: 4251.35,
      housingBenefit: 125.5,
      commission: 125.5,
      otherAllowance: 500,
      totalWage: 5002.35,
      contributoryWage: 140.695
    },
    update: false
  }
];
export const engagementData = {
  engagementId: 1569355076,
  fromJsonToObject: () => {
    return undefined;
  },
  joiningDate: {
    gregorian: '2020-02-05T00:00:00.000Z',
    hijiri: '1441-06-11'
  },
  prisoner: false,
  student: false,
  contributorAbroad: false,
  companyWorkerNumber: '8784545',
  workType: {
    arabic: 'دوام جزئي',
    english: 'Part Time'
  },
  engagementPeriod: [
    {
      occupation: {
        arabic: 'الفيزيائيون',
        english: 'Physicists'
      },
      startDate: {
        gregorian: '2020-02-05T03:00:00.000Z',
        hijiri: '1441-06-11'
      },
      endDate: {
        gregorian: '2020-02-29T03:00:00.000Z',
        hijiri: '1441-07-05'
      },
      coverageType: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      wage: {
        basicWage: 4250.35,
        housingBenefit: 125.5,
        commission: 125.5,
        otherAllowance: 500,
        totalWage: 5001.35,
        contributoryWage: 2250.1687
      },
      update: false
    }
  ],
  proactive: false,
  backdatingIndicator: false,
  status: 'LIVE',
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
      role: { arabic: 'فرعية', english: 'Kuwait' },
      userName: { arabic: 'فرعية', english: 'FCValidator' },
      bilingualComments: { arabic: 'فرعية', english: 'Kuwait' }
    }
  ],
  penaltyIndicator: null,
  formSubmissionDate: {
    gregorian: '2020-03-03T00:00:00.000Z',
    hijiri: '1441-07-08'
  },
  transactionRefNo: 0,
  approvalDate: {
    gregorian: '2020-03-03T00:00:00.000Z',
    hijiri: '1441-07-08'
  },
  anyPendingRequest: false,
  engagementPeriodInMonths: 1.8,
  isContributorActive: true
};

export const changedEngagementData = {
  engagementId: 1569355076,
  fromJsonToObject: {},
  joiningDate: {
    gregorian: '2020-02-05T00:00:00.000Z',
    hijiri: '1441-06-11'
  },
  prisoner: false,
  student: false,
  contributorAbroad: false,
  companyWorkerNumber: '8784545',
  contracts: [],
  workType: {
    arabic: 'دوام جزئي',
    english: 'Part Time'
  },
  engagementPeriod: [
    {
      occupation: {
        arabic: 'الفيزيائيون',
        english: 'Physicists'
      },
      startDate: {
        gregorian: '2020-02-05T03:00:00.000Z',
        hijiri: '1441-06-11'
      },
      endDate: {
        gregorian: '2020-02-29T03:00:00.000Z',
        hijiri: '1441-07-05'
      },
      coverageType: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      wage: {
        basicWage: 4250.35,
        housingBenefit: 125.5,
        commission: 225.5,
        otherAllowance: 500,
        totalWage: 5101.35,
        contributoryWage: 0
      },
      update: true
    },
    {
      occupation: {
        arabic: 'الفيزيائيون',
        english: 'Physicists'
      },
      startDate: {
        gregorian: '2020-03-01T03:00:00.000Z',
        hijiri: '1441-07-06'
      },
      coverageType: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        },
        {
          arabic: 'أخطار',
          english: 'Occupational Hazard'
        }
      ],
      wage: {
        basicWage: 4251.35,
        housingBenefit: 125.5,
        commission: 125.5,
        otherAllowance: 500,
        totalWage: 5002.35,
        contributoryWage: 140.695
      },
      update: false
    }
  ],
  proactive: false,
  backdatingIndicator: false,
  status: 'LIVE',
  transactionReferenceData: [],
  penaltyIndicator: null,
  formSubmissionDate: {
    gregorian: '2020-03-03T00:00:00.000Z',
    hijiri: '1441-07-08'
  },
  transactionRefNo: 0,
  approvalDate: {
    gregorian: '2020-03-03T00:00:00.000Z',
    hijiri: '1441-07-08'
  },
  anyPendingRequest: false,
  engagementPeriodInMonths: 1.8,
  isContributorActive: true,
  updatedPeriod: {
    occupation: {
      arabic: 'الفيزيائيون',
      english: 'Physicists'
    },
    startDate: {
      gregorian: '2020-02-05T03:00:00.000Z',
      hijiri: '1441-06-11'
    },
    endDate: {
      gregorian: '2020-02-29T03:00:00.000Z',
      hijiri: '1441-07-05'
    },
    coverageType: [
      {
        arabic: 'معاشات',
        english: 'Annuity'
      }
    ],
    wage: {
      basicWage: 4250.35,
      housingBenefit: 125.5,
      commission: 225.5,
      otherAllowance: 500,
      totalWage: 5101.35,
      contributoryWage: 0
    },
    update: true
  }
};

export const changeEngagementEstablishment = {
  activityType: {
    arabic: 'البيع بالتجزئة الأخرى خارج المتاجر والأكشاك والأسواق',
    english: 'Other retail sale not in stores, stalls or markets'
  },
  name: {
    arabic: '???? ??? ?????????? ??????/???????????',
    english: 'unitednations'
  },
  fieldOfficeName: null,
  nationalityCode: {
    arabic: 'السعودية',
    english: 'Saudi Arabia'
  },
  establishmentType: {
    arabic: 'رئيسية',
    english: 'Main'
  },
  legalEntity: {
    arabic: 'منشأة فردية',
    english: 'Individual'
  },
  registrationNo: 200085744,
  mainEstablishmentRegNo: 200085744,
  organizationCategory: {
    arabic: 'خليجية',
    english: 'GCC'
  },
  recruitmentNo: null,
  startDate: {
    gregorian: new Date('2002-09-08T00:00:00.000Z'),
    hijiri: '1423-07-01'
  },
  contactDetails: null,
  status: 'REGISTERED',
  scanDocuments: null,
  comments: null,
  transactionMessage: null,
  transactionReferenceData: null,
  proactive: false,
  navigationIndicator: null,
  validatorEdited: null,
  adminRegistered: null,
  transactionTracingId: null,
  gccCountry: false,
  fromJsonToObject: () => {
    return undefined;
  }
};

export const changeEngagementPerson = {
  id: null,
  birthDate: {
    gregorian: new Date(),
    hijiri: '1380-07-01'
  },
  deathDate: null,
  borderNo: null,
  education: {
    arabic: 'دبلوم',
    english: 'Diploma'
  },
  maritalStatus: {
    arabic: 'اعزب',
    english: 'Single'
  },
  name: {
    arabic: {
      firstName: '????',
      secondName: '????',
      thirdName: '????',
      familyName: '????'
    },
    english: {
      name: 'AAA AAA AAA AAA'
    }
  },
  fullName: null,
  nationality: {
    arabic: 'السعودية',
    english: 'Saudi Arabia'
  },
  identity: [
    {
      idType: 'NIN',
      newNin: 1234566600,
      oldNin: null,
      oldNinDateOfIssue: null,
      oldNinIssueVillage: null,
      expiryDate: null
    }
  ],
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  specialization: {
    arabic: 'اللغات و الترجمة',
    english: 'اللغات و الترجمة'
  },
  lifeStatus: null,
  personType: 'Saudi_Person',
  student: false,
  prisoner: false,
  personId: 1036884615,
  role: null,
  iqama: null,
  passport: null,
  nin: null,
  nationalId: null,
  govtEmp: false
};

export const engagementInChangeWorkflow = {
  changeInJoiningOrLeavingData: true,
  penaltyIndicator: false,
  formSubmissionDate: {
    gregorian: new Date('2020-04-08T12:13:25.000Z'),
    hijiri: '1441-08-15'
  },
  basicDetails: {
    current: {
      joiningDate: {
        gregorian: new Date('2020-03-01T00:00:00.000Z'),
        hijiri: '1441-07-06'
      },
      leavingDate: null,
      leavingReason: null,
      companyWorkerNumber: null
    },
    updated: {
      joiningDate: {
        gregorian: new Date('2020-03-01T00:00:00.000Z')
      },
      leavingDate: null,
      leavingReason: null,
      companyWorkerNumber: null
    }
  },
  wagePeriods: [
    {
      updated: [
        {
          id: 1788608636,
          occupation: {
            arabic: 'الفيزيائيون',
            english: 'Physicists'
          },
          startDate: {
            gregorian: new Date('2020-04-01T00:00:00.000Z')
          },
          wage: {
            basicWage: 90000,
            housingBenefit: 125.8,
            commission: 125.5,
            otherAllowance: 501,
            totalWage: 90752.3,
            contributoryWage: 9885
          },
          editFlow: false,
          contributorAbroad: true,
          endDate: {
            gregorian: new Date('2020-03-01T00:00:00.000Z'),
            hijiri: '1441-07-06'
          },
          coverages: [],
          minDate: new Date('2020-04-01T00:00:00.000Z'),
          monthlyContributoryWage: 2500,
          lastUpdatedDate: {
            gregorian: new Date('2020-03-01T00:00:00.000Z'),
            hijiri: '1441-07-06'
          },
          coverageType: [],
          periodDuration: {
            noOfMonths: 15,
            noOfDays: 2
          }
        }
      ],
      current: {
        id: 1788608636,
        occupation: {
          arabic: 'اختصاصي مطافئ طائرات',
          english: 'Aircraft fire fighting specialist'
        },
        startDate: {
          gregorian: new Date('2020-04-01T00:00:00.000Z'),
          hijiri: '1441-08-08'
        },
        wage: {
          basicWage: 90000,
          housingBenefit: 125.8,
          commission: 125.5,
          otherAllowance: 500,
          totalWage: 90751.3,
          contributoryWage: 9885
        },
        editFlow: false,
        contributorAbroad: false,
        endDate: {
          gregorian: new Date('2020-03-01T00:00:00.000Z'),
          hijiri: '1441-07-06'
        },
        coverages: [],
        minDate: new Date('2020-04-01T00:00:00.000Z'),
        monthlyContributoryWage: 2500,
        lastUpdatedDate: {
          gregorian: new Date('2020-03-01T00:00:00.000Z'),
          hijiri: '1441-07-06'
        },
        coverageType: [],
        periodDuration: {
          noOfMonths: 15,
          noOfDays: 2
        }
      }
    }
  ],
  transactionReferenceData: [],
  transactionRefNo: 269743,
  docFetchTypes: ['CHANGE_BACKDATED_WAGE']
};

export const periodChangeResponse = {
  message: { english: 'Data saved successfully', arabic: '' },
  docFetchTypes: ['CHANGE_BACKDATED_WAGE'],
  referenceNo: 260612
};

export const getEstablishmentResponse = {
  organizationCategory: null,
  registrationNo: 593277929,
  name: { arabic: 'شبشسيبشسيب', english: null },
  comments: '',
  transactionMessage: { arabic: 'شبشسيبشسيب', english: null },
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
  transactionTracingId: 123,
  navigationIndicator: 1,
  fieldOfficeName: null,
  validatorEdited: false,
  adminRegistered: false
};
export const requiredDocumentData = [
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
    uploaded: true,
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
    uploaded: true,
    valid: false
  }
];

export const getWageWorkflorResponse = {
  joiningDate: {
    gregorian: new Date('2020-03-01T00:00:00.000Z'),
    hijiri: '1441-07-06'
  },
  updateWageList: [{ currentWage: engagementPeriod, updatedWage: engagementPeriod }]
};

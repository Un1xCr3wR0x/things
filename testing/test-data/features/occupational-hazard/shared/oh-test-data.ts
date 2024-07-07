import { FormBuilder } from '@angular/forms';
import { bindToObject, DocumentItem, Role, RouterConstants } from '@gosi-ui/core';
import { PersonalInformation } from 'testing';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const sinResponseData = {
  approvalStatus: 'WORKFLOW IN ADD ENGAGEMENT',
  mergedSocialInsuranceNo: 123456768,
  mergerStatus: 'Not Merged',
  engagements: [],
  active: true,
  person: PersonalInformation,
  socialInsuranceNo: 419733520,
  vicIndicator: false,
  contributorType: 'NON_SAUDI',
  statusType: 'ACTIVE'
};
export const identity = [
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
];
export const documentResonseOh = {
  content: 'dfsvsdfgv',
  documentName: 'passport',
  fileName: 'dfsdf',
  id: '123',
  contentId: 'string',
  registrationNumber: '524512312'
};
export const rejectedServices = [
  {
    comments: ['dffdgdf'],
    serviceDetails: {
      invoiceItemId: 123,
      serviceRejectionDetails: [
        {
          disputedUnits: 12,
          rejectionReason: {
            english: ['frewrew'],
            arabic: ['rewre']
          },
          serviceId: null
        }
      ]
    }
  }
];
export const rejectRequests = {
  allowanceRejection: [
    {
      claimId: 321,
      rejectedPeriod: {
        endDate: {
          gregorian: '2021-01-15T13:47:13.000Z',
          hijiri: '1442-06-02'
        },
        startDate: {
          gregorian: '2021-01-10T00:00:00.000Z',
          hijiri: '1442-05-26'
        }
      },
      visits: 1
    }
  ],
  rejectionReason: {
    english: ['frewrew'],
    arabic: ['rewre']
  },
  comments: ['dffdgdf'],
  caseId: 12
};
export const filterParams = {
  endDate: '20-03-2021',
  maxAmount: 123,
  minAmount: 23,
  startDate: '20-03-2021',
  treatmentDays: [1, 2, 3],
  isMaxLimitExcluded: true
};
export const claimsfilterParams = {
  endDate: '20-03-2021',
  maxAmount: 123,
  minAmount: 23,
  startDate: '20-03-2021',
  claimType: ['Reimbursement'],
  claimPayee: ['Contributor'],
  claimStatus: ['approve']
};

export const treatmentFilter = [
  {
    maxAmount: '123',
    minAmount: '23',
    endDate: '20-03-2021',
    startDate: '20-03-2021',
    type: []
  }
];
export const transactionReferenceDataAudit = [
  {
    clarificationComments: 'comments',
    clarificationRead: false,
    requestComments: 'comments',
    requestedDate: {
      gregorian: '',
      hijiri: ''
    },
    resolvedDate: {
      gregorian: '',
      hijiri: ''
    },
    role: 'Auditor',
    user: 'TPA',
    serviceId: [1, 2, 3]
  }
];
export const documentItemDataAudit = {
  documentContent: null,
  name: {
    arabic: '',
    english: ''
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
export const allowanceSummary = {
  allowanceDates: {
    startDate: {
      gregorian: '2021-01-10T00:00:00.000Z',
      hijiri: '1442-05-26'
    },
    endDate: {
      gregorian: '2021-01-15T13:47:13.000Z',
      hijiri: '1442-06-02'
    }
  },
  allowancePeriod: [
    {
      allowanceType: {
        arabic: 'البدل اليومي للمنوم',
        english: 'InPatient Daily Allowance'
      },
      allowanceDays: 6,
      visits: 0,
      distanceTravelled: 0
    },
    {
      allowanceType: {
        arabic: 'بدل النقل',
        english: 'Conveyance Allowance'
      },
      allowanceDays: 6,
      visits: 2,
      distanceTravelled: 0
    },
    {
      allowanceType: {
        arabic: 'البدل اليومي للمرافق',
        english: 'Companion Daily Allowance'
      },
      allowanceDays: 6,
      visits: 0,
      distanceTravelled: 0
    },
    {
      allowanceType: {
        arabic: 'بدل النقل للمرافق',
        english: 'Companion Conveyance Allowance'
      },
      allowanceDays: 6,
      visits: 0,
      distanceTravelled: 100
    }
  ],
  auditReason: null,
  comments: null
};
export const allowance = {
  caseId: 13,
  injuryNo: 32453643,
  registrationNo: 2433634,
  socialInsuranceNo: 343466,
  isViewed: false,
  auditDetail: [
    {
      allowanceDates: {
        startDate: {
          gregorian: '2021-01-10T00:00:00.000Z',
          hijiri: '1442-05-26'
        },
        endDate: {
          gregorian: '2021-01-10T00:00:00.000Z',
          hijiri: '1442-05-26'
        }
      },
      minDate: {
        gregorian: '2021-01-10T00:00:00.000Z',
        hijiri: '1442-05-26'
      },
      maxDate: {
        gregorian: '2021-01-10T00:00:00.000Z',
        hijiri: '1442-05-26'
      },
      minEndDate: {
        gregorian: '2021-01-10T00:00:00.000Z',
        hijiri: '1442-05-26'
      },
      allowanceDays: 4564,
      disabled: false,
      rejectionDates: {
        gregorian: '2021-01-10T00:00:00.000Z',
        hijiri: '1442-05-26'
      },
      rejectedAllowanceDetails: {
        claimId: 123,
        rejectedPeriod: {
          endDate: {
            gregorian: '2021-01-10T00:00:00.000Z',
            hijiri: '1442-05-26'
          },
          startDate: {
            gregorian: '2021-01-10T00:00:00.000Z',
            hijiri: '1442-05-26'
          }
        },
        visits: 312
      },
      allowanceSubType: {
        arabic: 'بدل النقل للمرافق',
        english: 'Companion Conveyance Allowance'
      },
      allowanceType: {
        arabic: 'بدل النقل للمرافق',
        english: 'Companion Conveyance Allowance'
      },
      auditorRejectedClaim: false,
      rejectedAllowanceDays: 234,
      transactionId: 23435,
      treatment: 4334,
      caseId: 234,
      distanceTravelled: 23,
      amount: 231,
      visits: 67,
      rejectedVisits: 45,
      visitList: [
        {
          hasError: true,
          items: [],
          errorMessage: {
            arabic: '',
            english: ''
          }
        }
      ]
    }
  ],
  totalAllowances: 2432,
  newAllowances: 4345,
  ohType: 2,
  treatmentPeriod: [
    {
      endDate: {
        gregorian: '2021-01-01T00:00:00.000Z',
        hijiri: '1442-05-17'
      },
      startDate: {
        gregorian: '2021-01-01T00:00:00.000Z',
        hijiri: '1442-05-17'
      }
    }
  ],
  cchiNo: [123, 14],
  providerName: [
    {
      arabic: 'تم اعتماد المعاملة.',
      english: 'Abdul'
    }
  ],
  type: {
    arabic: 'بدل النقل للمرافق',
    english: 'Companion Conveyance Allowance'
  }
};
export const auditDetails = {
  tpaId: 1,
  tpaName: 'TCS',
  batchMonth: {
    gregorian: '2021-01-01T00:00:00.000Z',
    hijiri: '1442-05-17'
  },
  auditCases: [
    {
      caseId: 1001994815,
      socialInsuranceNo: 621463616,
      registrationNo: 509883270,
      totalAllowances: 7,
      newAllowances: 1
    },
    {
      caseId: 1001994940,
      socialInsuranceNo: 631552358,
      registrationNo: 501338923,
      totalAllowances: 1,
      newAllowances: 0
    }
  ]
};
export const approveResponse = {
  name: {
    arabic: 'تم اعتماد المعاملة.',
    english: 'Transaction is approved.'
  }
};
export const treatmentData = {
  invoiceItemId: 123,
  serviceCount: 3,
  totalAmount: 231,
  services: [
    {
      claimedAmount: 123,
      discount: 123,
      medicalDeduction: 123,
      noOfUnits: 2,
      paidAmount: 123,
      disputedUnits: 3,
      policyDeduction: 123,
      serviceDescription: 'fdesc',
      serviceId: 1234,
      treatmentDate: '23-45-2010',
      unitPrice: 1,
      unitLovList: {
        items: [
          { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
          { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
          { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
        ]
      },
      vat: 123
    }
  ]
};
export const invoiceData = {
  batchMonth: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  cchiNo: 0,
  tpaId: 123,
  tpaName: 'ANhu',
  previousInvoiceId: 12321,
  type: {
    english: 'Anu',
    arabic: ''
  },
  disabilityAssessment: 13221,
  inPatientAmount: 242,
  noOfOhCases: 4564,
  outPatientAmount: 35346,
  totalMedAmount: 32425,
  totalServiceAmount: 132,
  providerName: {
    english: 'Anu',
    arabic: ''
  },
  cases: [
    {
      claimNo: 2131,
      discount: 21344,
      endDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      },
      injuryNo: 4232432,
      invoiceId: 3425,
      invoiceItemId: 342,
      medicine: 6565,
      ohId: 4545,
      ohType: 56,
      regNo: 6565,
      service: 656,
      sin: 6776,
      startDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      },
      totalAmount: 345,
      vat: 657,
      policyDeduction: 566,
      medicalDeduction: 5656,
      isViewed: false
    }
  ]
};
export const previousClaims = {
  message: {
    english: 'Not Available',
    arabic: ''
  },
  previousClaims: {
    amount: 123,
    batchMonth: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    claimId: 2442,
    invoiceId: 100,
    vat: 32,
    batchMonthString: 'MAY',
    batchYear: '2020'
  }
};
export const claimSummary = {
  claimNo: 132,
  discount: 132,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  injuryNo: 132,
  invoiceId: 132,
  invoiceItemId: 132,
  payableAmount: 132,
  medicine: 132,
  ohId: 132,
  ohType: 132,
  regNo: 132,
  service: 132,
  sin: 132,
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  totalAmount: 132,
  vat: 132,
  policyDeduction: 132,
  medicalDeduction: 132,
  isViewed: false
};
export const paymentSummaryClaims = {
  claimNo: 12123,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  injuryNo: 2314,
  medicine: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  ohId: 2314,
  ohType: 0,
  regNo: 2314,
  service: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  sin: 2314,
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  }
};
export const paymentSummaryClaimsForDisease = {
  claimNo: 12123,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  injuryNo: 2314,
  medicine: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  ohId: 2314,
  ohType: 1,
  regNo: 2314,
  service: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  sin: 2314,
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  }
};
export const paymentSummaryClaimsForComplication = {
  claimNo: 12123,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  injuryNo: 2314,
  medicine: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  ohId: 2314,
  ohType: 2,
  regNo: 2314,
  service: {
    amount: 234,
    discount: 45,
    medicalDeduction: 65,
    policyDeduction: 56,
    vat: 45
  },
  sin: 2314,
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  }
};

export const injuryHistory = {
  complication: [
    {
      selectedSIN: 60136335,
      registrationNo: 10000602,
      injuryNo: 1002318957,
      injuryId: 1002318957,
      engagementId: 1234556767,
      establishmentName: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      actualStatus: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      status: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      date: {
        gregorian: new Date(),
        hijiri: ''
      },
      place: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      type: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      injuryType: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      location: null,
      establishmentRegNo: 10000602,
      injuryReason: {
        arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
        english:
          'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
      },
      addComplicationAllowed: false
    }
  ],
  selectedSIN: 60136335,
  registrationNo: 10000602,
  injuryNo: 1002318957,
  injuryId: 1002318957,
  engagementId: 1234556767,
  establishmentName: {
    arabic: 'التعرض لقوى ميكانيكية ية',
    english: 'EXPOSURE TO LIVING FORCES'
  },
  actualStatus: {
    arabic: 'مشروع',
    english: 'Draft'
  },
  status: {
    arabic: 'مشروع',
    english: 'Draft'
  },
  date: {
    gregorian: new Date(),
    hijiri: ''
  },
  place: {
    arabic: 'الإصابة',
    english: 'Injury'
  },
  type: {
    arabic: 'الإصابة',
    english: 'Injury'
  },
  injuryType: {
    arabic: 'التعرض لقوى ميكانيكية ية',
    english: 'EXPOSURE TO LIVING FORCES'
  },
  location: null,
  injuryDetails: {
    injuryTime: ''
  },
  establishmentRegNo: 10000602,
  injuryReason: {
    arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
    english:
      'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
  },
  addComplicationAllowed: false
};
export const injuryfilter = {
  location: [
    {
      arabic: 'التعرض لقوى ميكانيكية ية',
      english: 'Rokho'
    }
  ],
  status: [
    {
      arabic: 'التعرض لقوى ميكانيكية ية',
      english: 'Approved'
    },
    {
      arabic: 'التعرض لقوى ميكانيكية ية',
      english: 'Closed'
    }
  ]
};

export const injuryHistoryResponseTestDataTwo = {
  totalCount: 2,
  injuryHistory: [],
  diseasePresent: false
};
export const injuryHistoryResponseTestData = {
  totalCount: 2,
  injuryHistory: [
    {
      selectedSIN: 60136335,
      registrationNo: 10000602,
      establishmentRegNo: 10000602,
      injuryNo: 1002318957,
      injuryId: 1002318957,
      establishmentName: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      date: {
        gregorian: new Date(),
        hijiri: ''
      },
      type: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      injuryType: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      location: null,
      place: null,
      injuryDetails: {
        injuryTime: ''
      },
      status: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      actualStatus: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      injuryReason: {
        arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
        english:
          'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
      },
      complication: [
        {
          injuryNo: 1002318957,
          injuryId: 1002318957,
          place: null,
          date: {
            gregorian: new Date(),
            hijiri: ''
          },
          establishmentName: {
            arabic: 'التعرض لقوى ميكانيكية ية',
            english: 'EXPOSURE TO LIVING FORCES'
          },
          type: {
            arabic: 'الإصابة',
            english: 'Injury'
          },
          injuryType: {
            arabic: 'التعرض لقوى ميكانيكية ية',
            english: 'EXPOSURE TO LIVING FORCES'
          },
          injuryReason: {
            arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
            english:
              'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
          },
          location: null,
          status: {
            arabic: 'مشروع',
            english: 'Draft'
          },
          complication: [],
          establishmentRegNo: 10000602,
          engagementId: null,
          addComplicationAllowed: false
        },
        {
          injuryNo: 1002318957,
          injuryId: 1002318957,
          date: {
            gregorian: new Date(),
            hijiri: ''
          },
          establishmentName: {
            arabic: 'التعرض لقوى ميكانيكية ية',
            english: 'EXPOSURE TO LIVING FORCES'
          },
          type: {
            arabic: 'الإصابة',
            english: 'Injury'
          },
          injuryType: {
            arabic: 'التعرض لقوى ميكانيكية ية',
            english: 'EXPOSURE TO LIVING FORCES'
          },
          injuryReason: {
            arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
            english:
              'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
          },
          location: null,
          status: {
            arabic: 'مشروع',
            english: 'Draft'
          },
          complication: [],
          establishmentRegNo: 10000602,
          engagementId: null,
          addComplicationAllowed: false
        }
      ],
      engagementId: null,
      addComplicationAllowed: false
    }
  ],
  diseasePresent: false
};
export class ClaimsForm {
  engNameMaxLength = 60;
  arabicNameMaxLength = 80;
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}

  public createAuditForm() {
    return this.fb.group({
      auditComments: 'dsfdf',
      auditReason: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
}
export const injuryHistoryTestData = {
  selectedSIN: 60136335,
  registrationNo: 10000602,
  establishmentRegNo: 10000602,
  injuryNo: 1002318957,
  injuryId: 1002318957,
  complicationId: 1002318957,
  establishmentName: {
    arabic: 'التعرض لقوى ميكانيكية ية',
    english: 'EXPOSURE TO LIVING FORCES'
  },
  date: {
    gregorian: new Date(),
    hijiri: ''
  },
  type: {
    arabic: 'الإصابة',
    english: 'Injury'
  },
  injuryType: {
    arabic: 'التعرض لقوى ميكانيكية ية',
    english: 'EXPOSURE TO LIVING FORCES'
  },
  location: null,
  place: null,
  injuryDetails: {
    injuryTime: ''
  },
  status: {
    arabic: 'مشروع',
    english: 'Draft'
  },
  actualStatus: {
    arabic: 'مشروع',
    english: 'Draft'
  },
  injuryReason: {
    arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
    english:
      'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
  },
  complication: [
    {
      injuryNo: 1002318957,
      injuryId: 1002318957,
      place: null,
      date: {
        gregorian: new Date(),
        hijiri: ''
      },
      establishmentName: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      type: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      injuryType: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      injuryReason: {
        arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
        english:
          'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
      },
      location: null,
      status: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      complication: [],
      establishmentRegNo: 10000602,
      engagementId: null,
      addComplicationAllowed: false
    },
    {
      injuryNo: 1002318957,
      injuryId: 1002318957,
      date: {
        gregorian: new Date(),
        hijiri: ''
      },
      establishmentName: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      type: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      injuryType: {
        arabic: 'التعرض لقوى ميكانيكية ية',
        english: 'EXPOSURE TO LIVING FORCES'
      },
      injuryReason: {
        arabic: 'استنشاق وابتلاع أشياء أخرى التي تسبب انسداد الجهاز التنفسي , مكان غير محدد ، أثناء نشاط غير محدد',
        english:
          'Inhalation and ingestion of other objects causing obstruction of respiratory tract, unspecified place, during unspecified activity'
      },
      location: null,
      status: {
        arabic: 'مشروع',
        english: 'Draft'
      },
      complication: [],
      establishmentRegNo: 10000602,
      engagementId: null,
      addComplicationAllowed: false
    }
  ],
  engagementId: null,
  addComplicationAllowed: false
};
export const finalSubmitInjury = {
  comments: 'dsf',
  injuryId: 1001952065
};
export const personDetailsTestData = {
  personId: 46200,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
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
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'فهد',
      thirdName: 'محمد',
      familyName: 'الريس'
    },
    english: {}
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  education: {
    arabic: 'أمي',
    english: 'Illiterate'
  },
  birthDate: {
    gregorian: '1932-10-31T00:00:00.000Z',
    hijiri: '1351-07-01'
  },
  deathDate: {
    gregorian: '2013-12-02T00:00:00.000Z',
    hijiri: '1435-01-29'
  },
  maritalStatus: {
    arabic: 'متزوج',
    english: 'Married'
  },
  lifeStatus: null,
  userPreferences: {
    commPreferences: 'Ar'
  },
  govtEmp: false,
  payeetype: 12345,
  contactDetail: {
    addresses: [
      {
        type: 'POBOX',
        country: {
          arabic: 'السعودية ',
          english: 'Saudi Arabia'
        },
        city: {
          arabic: 'الجابرية',
          english: 'Aljabryah'
        },
        postalCode: '00047',
        postBox: '088909',
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        }
      }
    ],
    emailId: {
      primary: 'APETER@gosi.gov.sa'
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '0510220145',
      secondary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null
    },
    faxNo: null,
    currentMailingAddress: 'POBOX',
    mobileNoVerified: false
  }
};
export const contributorSearchTestData = [
  {
    socialInsuranceNo: 601336235,
    vicIndicator: false,
    person: {
      personId: 1031169904,
      nationality: {
        arabic: 'الهند',
        english: 'India'
      },
      identity: [
        {
          idType: 'NIN',
          newNin: 1034402360,
          oldNin: null,
          oldNinDateOfIssue: null,
          oldNinIssueVillage: null,
          expiryDate: null
        },
        {
          idType: 'PASSPORT',
          passportNo: 'A09541604',
          expiryDate: null,
          issueDate: {
            gregorian: '2013-04-14T00:00:00.000Z',
            hijiri: '1434-06-04'
          }
        },
        {
          idType: 'IQAMA',
          iqamaNo: 2408227102,
          expiryDate: null
        },
        {
          idType: 'BORDERNO',
          id: 4032587356
        }
      ],
      name: {
        arabic: {
          firstName: 'محمد',
          secondName: 'رشاد',
          thirdName: 'مصطفى',
          familyName: 'ابو هنديه'
        },
        english: {
          name: 'Khalid hossaini'
        }
      },
      sex: {
        arabic: 'ذكر',
        english: 'Male'
      },
      education: {
        arabic: 'بكالوريس',
        english: 'Bachelor'
      },
      birthDate: {
        gregorian: '1984-09-26T00:00:00.000Z',
        hijiri: '1405-01-01'
      },
      maritalStatus: {
        arabic: 'اعزب',
        english: 'Single'
      },
      contactDetail: {
        addresses: [
          {
            type: 'POBOX',
            country: {
              arabic: 'السعودية ',
              english: 'Saudi Arabia'
            },
            city: {
              arabic: 'الجابرية',
              english: 'Aljabryah'
            },
            postalCode: '00047',
            postBox: '088909',
            cityDistrict: {
              arabic: 'ينبع',
              english: 'District0302'
            }
          }
        ],
        emailId: {
          primary: 'APETER@gosi.gov.sa'
        },
        telephoneNo: {
          primary: null,
          extensionPrimary: null,
          secondary: null,
          extensionSecondary: null
        },
        mobileNo: {
          primary: '0510220145',
          secondary: null,
          isdCodePrimary: null,
          isdCodeSecondary: null
        },
        faxNo: null,
        currentMailingAddress: 'POBOX',
        mobileNoVerified: false
      },
      userPreferences: {
        commPreferences: 'En'
      },
      prisoner: false,
      student: false,
      govtEmp: false,
      personType: 'Saudi_Person'
    },
    hasActiveWorkFlow: false,
    contributorType: 'SAUDI',
    active: false
  }
];

export const engagementTestData = {
  approvalDate: { gregorian: '2016-03-23T00:00:00.000Z', hijiri: '1437-06-14' },
  backdatingIndicator: false,
  contributorAbroad: false,
  engagementId: 1552527046,
  engagements: [
    {
      joiningDate: {
        gregorian: '2012-01-01T00:00:00.000Z',
        hijiri: '1433-02-07'
      },
      engagementPeriod: [
        {
          occupation: {
            arabic: 'مهندس مشروع',
            english: 'Project engineer'
          }
        }
      ],
      prisoner: false,
      student: false,
      contributorAbroad: false,
      proactive: false,
      backdatingIndicator: false,
      status: 'LIVE',
      penaltyIndicator: null,
      occupation: {
        arabic: 'مهندس مشروع',
        english: 'Project engineer'
      },
      transactionRefNo: 0,
      isContributorActive: false
    }
  ],
  engagementPeriod: [
    {
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: null
      },
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: null
      },
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
  anyPendingRequest: false,
  isContributorActive: true,
  joiningDate: { gregorian: '2016-03-06T00:00:00.000Z', hijiri: '1437-05-26' },
  penaltyIndicator: null,
  prisoner: false,
  proactive: true,
  status: 'LIVE',
  student: false,
  transactionRefNo: 0
};
export const personUpdateFeedbackTestData = {
  transactionMessage: {
    arabic: 'تم الإبلاغ عن إنتكاسة بنجاح',
    english: 'Person Updated'
  }
};
export const commentsTestData = [
  {
    referenceNo: 1233,
    createdDate: {
      gregorian: '2019-08-02T00:00:00.000Z',
      hijiri: '1440-12-01'
    },
    transactionType: 'tert',
    bilingualComments: [
      {
        arabic: 'رفض',
        english: 'Rejected'
      }
    ],
    comments: 'fsd',
    rejectionReason: {
      arabic: 'رفض',
      english: 'Rejected'
    },
    returnReason: {
      arabic: 'رفض',
      english: 'Rejected'
    },
    role: {
      arabic: 'رفض',
      english: 'Rejected'
    },
    transactionStepStatus: 'Initiate Rejection',
    userName: {
      arabic: 'رفض',
      english: 'Rejected'
    }
  }
];
export const scanDocuments: DocumentItem[] = [
  {
    documentContent: null,
    documentType: null,
    name: {
      arabic: 'نموذج تفويض مشرف المنشأة',
      english: 'Admin Authorization Letter'
    },
    required: true,
    reuse: false,
    started: false,
    valid: false,
    contentId: 'FEAAPPLVD02001268',
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
    referenceNo: null,
    canDelete: true,
    uuid: '6e916bfc-5b86-496c-b109-49545d66977',
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    fileName: 'test',
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  },
  {
    documentContent: 'hjsgadhj',
    documentType: null,
    name: {
      arabic: 'نموذج طلب التسجيل',
      english: 'Registration Request Form or Letter'
    },
    required: true,
    reuse: false,
    started: false,
    valid: false,
    contentId: 'FEAAPPLVD02001269',
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
    referenceNo: null,
    canDelete: true,
    uuid: '6e916bfc-5b86-496c-b109-49545d66977',
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    fileName: 'test1',
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  }
];
export const scanDocumentsReim: DocumentItem[] = [
  {
    documentContent: 'jhdjahsjh',
    documentType: null,
    name: {
      arabic: 'نموذج تفويض مشرف المنشأة',
      english: 'Admin Authorization Letter'
    },
    required: true,
    reuse: false,
    started: false,
    valid: false,
    contentId: 'FEAAPPLVD02001268',
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
    referenceNo: null,
    canDelete: true,
    uuid: '6e916bfc-5b86-496c-b109-49545d66977',
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    fileName: 'test',
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  },
  {
    documentContent: 'hjsgadhj',
    documentType: null,
    name: {
      arabic: 'نموذج طلب التسجيل',
      english: 'Registration Request Form or Letter'
    },
    required: true,
    reuse: false,
    started: false,
    valid: false,
    contentId: 'FEAAPPLVD02001269',
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
    referenceNo: null,
    canDelete: true,
    uuid: '6e916bfc-5b86-496c-b109-49545d66977',
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    fileName: 'test1',
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  }
];
export const establishmentsTestData = {
  registrationNo: 10000602,
  name: {
    arabic: 'الشركة السعودية للكهرباء - منطقة اعمال الوسطى',
    english: 'Government Establisment'
  },
  legalEntity: {
    arabic: 'منشأة فردية',
    english: 'Individual'
  },
  nationalityCode: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  recruitmentNo: 7000579370,
  mainEstablishmentRegNo: 10000602,
  activityType: {
    arabic: 'أنشطة أخرى لتوليد الطاقة الكهربائية ونقلها وتوزيعها',
    english: 'Other activities of Electric power generation, transmission and distribution'
  },
  status: 'REGISTERED',
  gccCountry: false,
  crn: {
    number: 1010158683,
    issueDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    mciVerified: false
  },
  license: null,
  startDate: {
    gregorian: '1973-02-04T00:00:00.000Z',
    hijiri: '1393-01-01'
  },
  contactDetails: {
    addresses: [],
    emailId: {
      primary: 'noreply@gosi.gov.sa'
    },
    telephoneNo: {
      primary: '4032222',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: null,
      secondary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null
    },
    faxNo: null,
    currentMailingAddress: 'NATIONAL',
    mobileNoVerified: false
  },
  scanDocuments: [],
  transactionReferenceData: null,
  comments: null,
  transactionMessage: null,
  establishmentType: {
    arabic: 'رئيسية',
    english: 'Main'
  },
  proactive: false,
  establishmentAccount: {
    paymentType: null,
    startDate: null,
    bankAccount: {
      ibanAccountNo: null,
      bankName: null
    }
  },
  molEstablishmentIds: {
    molEstablishmentId: 59490,
    molOfficeId: 1,
    molEstablishmentOfficeId: 1,
    molunId: 59490
  },
  gccEstablishment: null,
  navigationIndicator: null,
  molRecordId: null,
  revisionList: null,
  transactionTracingId: 0,
  organizationCategory: {
    arabic: 'خليجية',
    english: 'GCC'
  },
  validatorEdited: false,
  adminRegistered: false
};
export const ReimbId = {
  referenceNo: 123,
  reimbursementId: 123
};
export const contributorsTestData = {
  establishmentRegNo: 10000602,
  establishmentId: 200085744,
  taskId: 'fesgerh-345gdf-fbhhn',
  registrationNo: 10000602,
  socialInsuranceNo: 419734586,
  personId: 46200,
  processType: 'modify',
  searchValue: '601336235',
  contactNo: 12234456567,
  complicationId: 1002318957,
  injuryId: 1002318957,
  reportType: 'Injury',
  estId: 10000602,
  injuryNo: 1234
};
export const searchTestData = {
  approvalStatus: 'WORKFLOW IN ADD ENGAGEMENT',
  mergedSocialInsuranceNo: 123456768,
  mergerStatus: 'Not Merged',
  engagements: [],
  active: true,
  person: personDetailsTestData,
  socialInsuranceNo: 419733520,
  vicIndicator: false
};
export const genericErrorOh = {
  error: {
    code: 'GF-ERR-0001',
    message: {
      english: 'Sorry, a problem has occurred, please try again later.',
      arabic: 'عذرًا، حدثت مشكلة.. فضلًا قم بإعادة المحاولة لاحقًا.'
    }
  }
};

export const docItem: DocumentItem = {
  documentContent: 'gffg',
  documentType: 'gfgf',
  name: { arabic: '', english: '' },
  required: false,
  reuse: false,
  started: false,
  valid: false,
  contentId: 'dfsg',
  fileName: 'ghj',
  sequenceNumber: 123,
  uploaded: false,
  isUploading: false,
  size: 'jj',
  isContentOpen: false,
  percentageLoaded: 123,
  icon: 'jj',
  businessKey: 123,
  transactionId: '3413',
  uuid: '6e916bfc-5b86-496c-b109-49545d66977',
  uploadFailed: false,
  isScanning: false,
  referenceNo: null,
  transactionReferenceIds: [],
  fromJsonToObject: () => {
    return undefined;
  },
  identifier: undefined,
  documentClassification: undefined,
  userAccessList: []
};
export const payeeDetails = {
  allowancePayee: 1,
  injuryDate: null,
  injuryNo: 12345,
  ohType: 0,
  ohDate: null
};
export const payeeDetailsType1 = {
  allowancePayee: 1,
  applicablePayee: [
    {
      english: 'Contributor',
      arabic: 'عالمح.'
    },
    {
      english: 'Establishment',
      arabic: 'ع لاحقًا.'
    }
  ],
  injuryDate: null,
  injuryNo: 12345,
  ohType: 1,
  ohDate: null
};
export const payeeDetailsType2 = {
  allowancePayee: 1,
  applicablePayee: [
    {
      english: 'Contributor',
      arabic: 'عالمح.'
    },
    {
      english: 'Establishment',
      arabic: 'ع لاحقًا.'
    }
  ],
  injuryDate: null,
  injuryNo: 12345,
  ohType: 2,
  ohDate: null
};
export const ReimbursementRequestData = {
  emailId: { primary: 'noreply@gosi.gov.sa' },
  isTreatmentWithinSaudiArabia: true,
  isdCode: 'sa',
  mobileNo: '3232388283',
  payableTo: 1,
  requestDate: '2000-05-03T00:00:00.000Z',
  status: {
    english: 'Paid',
    arabic: 'دفع'
  },
  supportingDocuments: [
    {
      contentId: 'fszfsfdsfdfdf',
      documentType: 123
    }
  ]
};
export const claimsDetails = {
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  totalAmount: 0,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  totalAllowance: '14',
  noOfDays: '8',
  paymentMethod: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  claims: [
    {
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      amount: 120,
      reImbId: 1034,
      invoiceItemId: 498,
      showDetails: true,
      invoiceNo: '123',
      expenseDetails: {
        totalAmount: 1200,
        endDate: new Date('2020-04-14T00:00:00.000Z'),
        startDate: new Date('2020-04-14T00:00:00.000Z'),
        invoiceNo: 123,
        expenseList: [
          {
            vat: '123',
            policyDeduction: '123',
            paidAmount: '123',
            medicalDeduction: '123',
            discount: '123',
            claimedAmount: '123',
            description: '123',
            treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
            serviceId: 123
          }
        ]
      },
      serviceDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      claimType: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      claimsPayee: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      endDate: {
        gregorian: new Date('2020-04-14T00:00:00.000Z'),
        hijiri: '1441-08-21'
      },
      expenses: {
        amount: 344,
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        id: 1234
      },
      invoiceNumber: '1234',
      accountNumber: 12345566,
      paymentDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitStartDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitEndDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      paymentStatus: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      payableTo: 'Contributor',
      requestDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      startDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      transactionId: 1234,
      calculationWrapper: {
        allowanceBreakup: {
          allowanceType: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          startDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          noOfVisits: 2,
          differenceinDay: 2,
          totalAllowance: 2,
          breakUpDetails: [],
          oldContributorWage: 'ds',
          newContributorWage: 'sf'
        },
        paymentDetails: {
          accountNo: '1234556',
          paymentDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          paymentMethod: '1234556',
          transactionId: '1234556',
          cashedDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          chequeNo: '1234556'
        },
        transactionMessage: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        }
      },
      companionDetails: {
        destinationLatitude: '12.344',
        destinationLongitude: 12,
        endDate: {
          gregorian: new Date('2020-04-14T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        name: 'xyz',
        originLatitude: '12.344',
        originLongitude: '12.344',
        startDate: {
          gregorian: new Date('2000-05-03T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        distanceTravelled: '3444',
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        isGreater: true,
        injuryIdList: []
      },
      claimId: 1234
    }
  ],
  payableTo: 'Contributor',
  sin: 10000602,
  transactionMessage: {
    english: null,
    arabic: null
  }
};
export const successMessage = {
  english: 'Transaction Is Submitted',
  arabic: 'Transaction Is Submitted'
};
export const expenseDetails = {
  totalAmount: 1200,
  endDate: new Date('2020-04-14T00:00:00.000Z'),
  startDate: new Date('2020-04-14T00:00:00.000Z'),
  invoiceNo: 123,
  expenseList: [
    {
      vat: '123',
      policyDeduction: '123',
      paidAmount: '123',
      medicalDeduction: '123',
      discount: '123',
      claimedAmount: '123',
      description: '123',
      treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
      serviceId: 123
    }
  ]
};

export const filterParamsClaims = {
  maxAmount: 123,
  minAmount: 22,
  endDate: '20-03-2021',
  startDate: '20-03-2021',
  claimType: [],
  claimPayee: [],
  claimStatus: []
};
export const claimsWrapper = {
  claimType: 2,
  totalAmount: 1000,
  actualPaymentStatus: {
    english: 'Rejected',
    arabic: 'دفع'
  },
  claims: [
    {
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      amount: 120,
      reImbId: 1034,
      invoiceItemId: 498,
      showDetails: true,
      invoiceNo: '123',
      expenseDetails: {
        totalAmount: 1200,
        endDate: new Date('2020-04-14T00:00:00.000Z'),
        startDate: new Date('2020-04-14T00:00:00.000Z'),
        invoiceNo: 123,
        expenseList: [
          {
            vat: '123',
            policyDeduction: '123',
            paidAmount: '123',
            medicalDeduction: '123',
            discount: '123',
            claimedAmount: '123',
            description: '123',
            treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
            serviceId: 123
          }
        ]
      },
      serviceDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      claimType: {
        english: 'Dead Body Repatriation Expenses',
        arabic: 'بدل النقل'
      },
      claimsPayee: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      endDate: {
        gregorian: new Date('2020-04-14T00:00:00.000Z'),
        hijiri: '1441-08-21'
      },
      expenses: [
        {
          amount: 344,
          type: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          id: 1234
        },
        {
          amount: 355,
          type: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          id: 12534
        }
      ],
      invoiceNumber: '1234',
      accountNumber: 12345566,
      paymentDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitStartDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitEndDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      paymentStatus: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      payableTo: 'Contributor',
      requestDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      startDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      transactionId: 1234,
      calculationWrapper: {
        allowanceBreakup: {
          allowanceType: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          startDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          noOfVisits: 2,
          differenceinDay: 2,
          totalAllowance: 2,
          breakUpDetails: [],
          oldContributorWage: 'ds',
          newContributorWage: 'sf'
        },
        paymentDetails: {
          accountNo: '1234556',
          paymentDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          paymentMethod: '1234556',
          transactionId: '1234556',
          cashedDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          chequeNo: '1234556'
        },
        transactionMessage: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        }
      },
      companionDetails: {
        destinationLatitude: '12.344',
        destinationLongitude: 12,
        endDate: {
          gregorian: new Date('2020-04-14T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        name: 'xyz',
        originLatitude: '12.344',
        originLongitude: '12.344',
        startDate: {
          gregorian: new Date('2000-05-03T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        distanceTravelled: '3444',
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        isGreater: true,
        injuryIdList: []
      },
      claimId: 1234
    }
  ],
  companion: {
    destinationLatitude: '12.344',
    destinationLongitude: 12,
    endDate: {
      gregorian: new Date('2020-04-14T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    name: 'xyz',
    originLatitude: '12.344',
    originLongitude: '12.344',
    startDate: {
      gregorian: new Date('2000-05-03T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    distanceTravelled: '3444',
    type: {
      english: 'Companion Allowance',
      arabic: 'بدل النقل'
    },
    isGreater: true,
    injuryIdList: []
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  expenses: [],
  payableTo: 'Contributor',
  sin: 10000602,
  startDate: {
    gregorian: new Date('2000-05-03T00:00:00.000Z'),
    hijiri: '1421-01-28'
  },
  transactionMessage: {
    english: 'Companion Allowance',
    arabic: 'بدل النقل'
  }
};
export const claimsWrapperData = {
  payeeDetails: null,
  claimType: 2,
  totalAmount: 1000,
  claims: [
    {
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      amount: 120,
      claimNo: 123456,
      reImbId: 12,
      tpaCode: 'TCS',
      invoiceId: 49,
      invoiceItemId: 498,
      referenceNo: 12314,
      claimId: 12345,
      showDetails: true,
      invoiceNo: '123',
      expenseDetails: {
        totalAmount: 1200,
        endDate: new Date('2020-04-14T00:00:00.000Z'),
        startDate: new Date('2020-04-14T00:00:00.000Z'),
        invoiceNo: 123,
        expenseList: [
          {
            vat: '123',
            policyDeduction: '123',
            paidAmount: '123',
            medicalDeduction: '123',
            discount: '123',
            claimedAmount: '123',
            description: '123',
            treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
            serviceId: 123
          }
        ]
      },
      serviceDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            totalAmount: 1234,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      recoveryDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        totalAmount: 123,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            totalAmount: 1234,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      claimType: {
        english: 'Cashless Claim',
        arabic: 'بدل النقل'
      },
      claimsPayee: 'Contributor',
      endDate: {
        gregorian: new Date('2020-04-14T00:00:00.000Z'),
        hijiri: '1441-08-21'
      },
      expenses: [
        {
          amount: 344,
          type: {
            english: 'Invoice Claim',
            arabic: 'بدل النقل'
          },
          id: 1234,
          startDate: {
            gregorian: new Date('2000-05-03T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          }
        }
      ],
      invoiceNumber: '1234',
      accountNumber: 12345566,
      paymentDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitStartDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitEndDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      paymentStatus: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      payableTo: 'Contributor',
      requestDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      startDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      transactionId: 1234,
      calculationWrapper: {
        allowanceBreakup: {
          allowanceType: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          startDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          noOfVisits: 2,
          differenceinDay: 2,
          totalAllowance: 2,
          breakUpDetails: [],
          oldContributorWage: 'ds',
          newContributorWage: 'sf'
        },
        paymentDetails: {
          accountNo: '1234556',
          paymentDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          paymentMethod: '1234556',
          transactionId: '1234556',
          cashedDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          chequeNo: '1234556'
        },
        transactionMessage: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        }
      },
      companionDetails: {
        destinationLatitude: '12.344',
        destinationLongitude: 12,
        endDate: {
          gregorian: new Date('2020-04-14T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        name: 'xyz',
        originLatitude: '12.344',
        originLongitude: '12.344',
        startDate: {
          gregorian: new Date('2000-05-03T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        distanceTravelled: '3444',
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        isGreater: true,
        injuryIdList: []
      }
    },
    {
      claimId: 12345,
      claimNo: 133456,
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      amount: 120,
      reImbId: null,
      tpaCode: 'TCS',
      invoiceId: 49,
      invoiceItemId: 498,
      showDetails: true,
      invoiceNo: '123',
      expenseDetails: {
        totalAmount: 1200,
        endDate: new Date('2020-04-14T00:00:00.000Z'),
        startDate: new Date('2020-04-14T00:00:00.000Z'),
        invoiceNo: 123,
        expenseList: [
          {
            vat: '123',
            policyDeduction: '123',
            paidAmount: '123',
            medicalDeduction: '123',
            discount: '123',
            claimedAmount: '123',
            description: '123',
            treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
            serviceId: 123
          }
        ]
      },
      serviceDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      claimType: {
        english: 'Cashless Claim',
        arabic: 'بدل النقل'
      },
      claimsPayee: 'Contributor',
      endDate: {
        gregorian: new Date('2020-04-14T00:00:00.000Z'),
        hijiri: '1441-08-21'
      },
      expenses: [
        {
          amount: 355,
          type: {
            english: 'VAT',
            arabic: 'بدل النقل'
          },
          id: 12534,
          startDate: {
            gregorian: new Date('2000-05-03T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          }
        }
      ],
      invoiceNumber: '1234',
      accountNumber: 12345566,
      paymentDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitStartDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitEndDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      paymentStatus: {
        english: 'Paid',
        arabic: 'بدل النقل'
      },
      payableTo: 'Contributor',
      requestDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      startDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      transactionId: 1235,
      calculationWrapper: {
        allowanceBreakup: {
          allowanceType: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          startDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          noOfVisits: 2,
          differenceinDay: 2,
          totalAllowance: 2,
          breakUpDetails: [],
          oldContributorWage: 'ds',
          newContributorWage: 'sf'
        },
        paymentDetails: {
          accountNo: '1234556',
          paymentDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          paymentMethod: '1234556',
          transactionId: '1234556',
          cashedDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          chequeNo: '1234556'
        },
        transactionMessage: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        }
      },
      companionDetails: {
        destinationLatitude: '12.344',
        destinationLongitude: 12,
        endDate: {
          gregorian: new Date('2020-04-14T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        name: 'xyz',
        originLatitude: '12.344',
        originLongitude: '12.344',
        startDate: {
          gregorian: new Date('2000-05-03T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        distanceTravelled: '3444',
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        isGreater: true,
        injuryIdList: []
      }
    }
  ],
  companion: {
    destinationLatitude: '12.344',
    destinationLongitude: 12,
    endDate: {
      gregorian: new Date('2020-04-14T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    name: 'xyz',
    originLatitude: '12.344',
    originLongitude: '12.344',
    startDate: {
      gregorian: new Date('2000-05-03T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    distanceTravelled: '3444',
    type: {
      english: 'Companion Allowance',
      arabic: 'بدل النقل'
    },
    isGreater: true,
    injuryIdList: []
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  expenses: [],
  payableTo: 'Contributor',
  sin: 10000602,
  startDate: {
    gregorian: new Date('2000-05-03T00:00:00.000Z'),
    hijiri: '1421-01-28'
  },
  transactionMessage: {
    english: 'Companion Allowance',
    arabic: 'بدل النقل'
  }
};
export const claimsWrapperReimb = {
  claimType: 2,
  totalAmount: 1000,
  claims: [
    {
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      claimNo: 1234,
      amount: 120,
      reImbId: 1034,
      invoiceItemId: 498,
      showDetails: true,
      invoiceNo: '123',
      invoiceId: 123466,
      referenceNo: 123123,
      expenseDetails: {
        totalAmount: 1200,
        endDate: new Date('2020-04-14T00:00:00.000Z'),
        startDate: new Date('2020-04-14T00:00:00.000Z'),
        invoiceNo: 123,
        claimId: 123,
        invoiceId: 5613,
        transactionId: 23143,
        expenseList: [
          {
            vat: '123',
            policyDeduction: '123',
            paidAmount: '123',
            medicalDeduction: '123',
            discount: '123',
            claimedAmount: '123',
            description: '123',
            treatmentDate: new Date('2020-04-14T00:00:00.000Z'),
            serviceId: 123
          }
        ]
      },
      serviceDetails: {
        invoiceItemId: 123,
        serviceCount: 2,
        services: [
          {
            claimedAmount: 123,
            discount: 123,
            medicalDeduction: 123,
            noOfUnits: 2,
            paidAmount: 123,
            disputedUnits: 3,
            policyDeduction: 123,
            serviceDescription: 'fdesc',
            serviceId: 1234,
            treatmentDate: '23-45-2010',
            unitPrice: 1,
            unitLovList: {
              items: [
                { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
                { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
                { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
              ]
            },
            vat: 123
          }
        ]
      },
      payeeDetails: {
        payableTo: {
          english: 'Contributor',
          arabic: 'دفع'
        },
        payeeId: 12345,
        payeeName: {
          english: 'Contributor',
          arabic: 'دفع'
        }
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      claimType: {
        english: 'Reimbursement',
        arabic: 'بدل النقل'
      },
      claimsPayee: 'claimsPayee',
      endDate: {
        gregorian: new Date('2020-04-14T00:00:00.000Z'),
        hijiri: '1441-08-21'
      },
      expenses: [
        {
          amount: 344,
          type: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          id: 1234,
          startDate: {
            gregorian: new Date('2000-05-03T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          transactionId: 23143,
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          }
        },
        {
          amount: 355,
          type: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          id: 12534,
          startDate: {
            gregorian: new Date('2000-05-03T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          }
        }
      ],
      invoiceNumber: '1234',
      accountNumber: 12345566,
      paymentDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitStartDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      benefitEndDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      paymentStatus: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      payableTo: 'Contributor',
      requestDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      startDate: {
        gregorian: new Date('2000-05-03T00:00:00.000Z'),
        hijiri: '1421-01-28'
      },
      transactionId: 1234,
      calculationWrapper: {
        allowanceBreakup: {
          allowanceType: {
            english: 'Companion Allowance',
            arabic: 'بدل النقل'
          },
          endDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          startDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1441-08-21'
          },
          noOfVisits: 2,
          differenceinDay: 2,
          totalAllowance: 2,
          breakUpDetails: [],
          oldContributorWage: 'ds',
          newContributorWage: 'sf'
        },
        paymentDetails: {
          accountNo: '1234556',
          paymentDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          paymentMethod: '1234556',
          transactionId: '1234556',
          cashedDate: {
            gregorian: new Date('2020-04-14T00:00:00.000Z'),
            hijiri: '1421-01-28'
          },
          chequeNo: '1234556'
        },
        transactionMessage: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        }
      },
      companionDetails: {
        destinationLatitude: '12.344',
        destinationLongitude: 12,
        endDate: {
          gregorian: new Date('2020-04-14T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        name: 'xyz',
        originLatitude: '12.344',
        originLongitude: '12.344',
        startDate: {
          gregorian: new Date('2000-05-03T00:00:00.000Z'),
          hijiri: '1421-01-28'
        },
        distanceTravelled: '3444',
        type: {
          english: 'Companion Allowance',
          arabic: 'بدل النقل'
        },
        isGreater: true,
        injuryIdList: []
      },
      claimId: 1234
    }
  ],
  companion: {
    destinationLatitude: '12.344',
    destinationLongitude: 12,
    endDate: {
      gregorian: new Date('2020-04-14T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    name: 'xyz',
    originLatitude: '12.344',
    originLongitude: '12.344',
    startDate: {
      gregorian: new Date('2000-05-03T00:00:00.000Z'),
      hijiri: '1421-01-28'
    },
    distanceTravelled: '3444',
    type: {
      english: 'Companion Allowance',
      arabic: 'بدل النقل'
    },
    isGreater: true,
    injuryIdList: []
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  expenses: [],
  payableTo: 'Contributor',
  sin: 10000602,
  startDate: {
    gregorian: new Date('2000-05-03T00:00:00.000Z'),
    hijiri: '1421-01-28'
  },
  transactionMessage: {
    english: 'Companion Allowance',
    arabic: 'بدل النقل'
  }
};
export const holdAllowanceDetails = {
  type: 1,
  requestType: 1,
  injuryNo: 1423534647,
  requestDate: { gregorian: new Date(), hijiri: new Date() },
  reason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  ohDate: { gregorian: new Date(), hijiri: new Date() },
  holdFromDate: { gregorian: new Date(), hijiri: new Date() }
};
export const holdAllowanceDetailsTwo = {
  type: 0,
  requestType: 1,
  injuryNo: 1423534647,
  requestDate: { gregorian: new Date(), hijiri: new Date() },
  reason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  ohDate: { gregorian: new Date(), hijiri: new Date() },
  holdFromDate: { gregorian: new Date(), hijiri: new Date() }
};
export const holdAllowanceDetailsThree = {
  type: 2,
  requestType: 1,
  injuryNo: 1423534647,
  requestDate: { gregorian: new Date(), hijiri: new Date() },
  reason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  ohDate: { gregorian: new Date(), hijiri: new Date() },
  holdFromDate: { gregorian: new Date(), hijiri: new Date() }
};
export const resumeData = {
  taskId: 'fesgerh-345gdf-fbhhn',
  resourceType: 'Hold Allowance',
  assignedRole: 'Validator1',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Hold Allowance","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const holdData = {
  taskId: 'fesgerh-345gdf-fbhhn',
  resourceType: 'Resume Allowance',
  assignedRole: 'Validator1',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Resume Allowance","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const reimbDetails = {};
export const allowanceDetails = {
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  transactionMessage: {
    english: 'sdffs',
    arabic: ''
  },
  ohDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  totalAllowance: '14',
  noOfDays: '8',
  paymentMethod: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  allowances: [
    {
      id: '12345',
      startDate: {
        gregorian: new Date(),
        hijiri: new Date()
      },
      transactionMessage: {
        english: '',
        arabic: ''
      },
      endDate: {
        gregorian: new Date(),
        hijiri: new Date()
      },
      allowanceType: {
        english: 'Companion Allowance',
        arabic: 'بدل النقل'
      },
      actualPaymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      treatmentType: {
        english: 'inPatient',
        arabic: 'في المريض'
      },
      amount: 5000,
      paymentStatus: {
        english: 'Paid',
        arabic: 'دفع'
      },
      paymentMethod: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      },
      paymentDate: {
        gregorian: new Date(),
        hijiri: new Date()
      },
      differenceInDays: 10
    }
  ]
};
export const documentItem = bindToObject(new DocumentItem(), docItem);

export const documentRespone = {
  content: 'fsdgdf',
  documentName: 'ghfhj',
  fileName: 'hfj',
  id: 'gjjg',
  name: 'sdfsdfdg'
};
export const initializeTheViewValidator1 = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const validator1ForReopen = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  resourceType: 'OH Reopen Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const validator1ForModify = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  resourceType: 'OH Reopen Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerData = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const initializeTheViewValidator2 = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'Validator2',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const initializeTheViewValidator = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  user: 'avijit',
  registrationNumber: 10000602,
  socialInsuranceNumber: 601336235,
  personId: 123234523,
  resourceType: 'Complication',
  tabIndicator: 4,
  resourceId: 13124124,
  channel: 'field-office',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"gosi-online","id":"1001926370","injuryId":"1001926370","transactionId":"3413"}]'
};

export const initializeTheViewGDS = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataInjury = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Injury",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataComplication = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Complication',
  payload:
    '[{"socialInsuranceNo":"601336235","injuryNo":"3214234",resource":"Injury" "injuryId:"2324325346",resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};

export const routerDataRejectInjury = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'OH Rejection Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataModifyInjury = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Modify Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataModifyComplication = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Modify Complication',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataReopnComplication = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Reopen Complication',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataAddAllowance = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Add allowance',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDatatotalrepartriation = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'ADD_TOTAL_DISABILITY_REPATRIATION',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataDeadBodyrepartriation = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'ADD_DEAD_BODY_REPATRIATION',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataNull = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: '',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataReopnInjury = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'OH Reopen Injury',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataRejectComplication = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'OH Rejection Complication',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataCloseComplication = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Close Complication TPA',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const routerDataCloseInjury = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'GeneralDirectorofOperationsandInsuranceServices',
  resourceType: 'Close Injury TPA',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","resourceType":"Complication",registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const initializeTheViewFCApprover = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'FinanceControl',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const reportInjuryFormData = {
  taskId: 'fdgdggfd-fsdfd',
  user: 'avijith',
  status: 'Cured with Disability',
  rejectionIndicator: 'No',
  comments: 'dd',
  rejectionReason: {
    arabic: 'رفض',
    english: 'Rejected'
  },
  injuryRejectionReason: {
    arabic: 'رفض',
    english: 'Rejected'
  }
};

export const initializeTheViewDoctor = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'Doctor',

  resourceType: 'Close Injury TPA',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const documentsItem = {
  contentId: '',
  type: {
    arabic: 'رفض',
    english: 'Rejected'
  },
  sequenceNumber: 134
};
export const personData = {
  nin: {
    newNin: 1002072509,
    expiryDate: {
      gregorian: new Date(),
      hijiri: new Date()
    },
    govtEmp: ''
  },
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'جاسم',
      thirdName: 'محمد',
      familyName: 'الخميس'
    },
    english: {
      name: ''
    }
  },
  specialization: {
    code: 4
  },
  nationality: {
    code: 1
  },
  sex: {
    code: 1002,
    description: 'Male'
  },
  maritalStatus: {
    code: 1001,
    description: 'Married'
  },
  birthDate: {
    gregorian: new Date(),
    hijiri: new Date()
  },
  education: {
    code: 1004,
    description: 'Bachelor'
  },
  borderNo: 0,
  contactDetail: [
    {
      additionalNumber: '1234',
      addressLine1: 'Al Janadriyah Suite-7',
      area: '',
      careOf: 'Test',
      city: {
        code: 302007,
        description: ''
      },
      country: {
        code: 1001,
        description: 'Saudi'
      },
      currentMailingAddrInd: 1,
      emailId: {
        primary: ''
      },
      extension: '1234',
      faxNumber: '12345',
      mobileNumber: {
        primary: '124536978'
      },
      parentPhoneNumber: '9947299886',
      postBox: 'Riyadh',
      postNumber: '670571',
      street: '',
      telephoneNumber: {
        extensionPrimary: '',
        primary: ''
      },
      unitNo: 1,
      villageId: 0,
      zipCode: '785467',
      type: 'poBox'
    }
  ]
};

export const closeInjuryTestData = {
  closedStatus: {
    english: 'Cured With Disability',
    arabic: 'علاجه مع الإعاقة'
  },
  isClosed: true
};

const stringJson = '{"RegistrationNo": "123","SocialInsuranceNo": "1234","EngagementId" : "20006272"}';

export const ohRouterData = {
  taskId: 'asd-qw-asdasdasd',
  assigneeId: null,
  assignedRole: Role.VALIDATOR_1,
  previousOwnerRole: null,
  resourceType: RouterConstants.TRANSACTION_ADD_IQAMA,
  route: null,
  resourceId: null,
  payload: stringJson,
  tabIndicator: 1,

  tabId: 1,
  transactionId: 20001,
  sourceChannel: null,
  idParams: null,
  documentFetchType: null
};
export const tabDetails = {
  requestDetails: {
    id: 'injury',
    value: 'REQUEST-DETAILS'
  },
  allowanceDetails: {
    id: 'Allowance',
    value: 'ALLOWANCE-DETAILS'
  },
  claimsDetails: {
    id: 'Claims',
    value: 'CLAIMS-DETAILS'
  }
};

export const auditorFilter = {
  ohType: ['injury'],
  maxAllowances: 10,
  minAllowances: 1,
  minNewAllowances: 1,
  maxNewAllowances: 11
};

export const allowanceFilter = {
  claimType: ['ConveyanceAllowance'],
  noOfDaysMax: 10,
  noOfDaysMin: 0,
  visitsMin: 0,
  visitsMax: 11
};
export const healthCareDetails = {
  reqDocs: [
  {
      docName: {
          english: "MRI Scan Report",
          arabic: "MRI Scan Report"
      },
      speciality: {
          english: "Neurology",
          arabic: "Neurology"
      }
  }
],
hospitals: [
  {
      name: {
          english: "Riyad Care hospital",
          arabic: "Riyad Care hospital"
      },
      location: {
          english: "Olaya street Riyadh",
          arabic: "Olaya street Riyadh"
      }
  }
]
};
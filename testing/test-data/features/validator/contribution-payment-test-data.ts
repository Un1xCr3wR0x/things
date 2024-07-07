/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const establishmentDetailsWrapper = {
  branchList: [
    {
      registrationNumber: 12345678,
      establishmentName: {
        arabic: null,
        english: 'xyzxyz'
      },
      establishmentType: {
        arabic: null,
        english: 'xyxyxyx'
      },
      status: {
        arabic: null,
        english: 'closed'
      }
    }
  ]
};
export const establishmentDetails = {
  mainEstablishmentRegNo: 12345678,
  name: {
    arabic: null,
    english: 'xyzxyz'
  },
  gccEstablishment: {
    country: {
      arabic: null,
      english: 'Saudi'
    },
    gccCountry: {
      arabic: null,
      english: 'Kuwait'
    },
    registrationNo: 'xyxyxyx'
  },
  legalEntity: {
    arabic: null,
    english: 'Limited Partnership'
  }
};
export const establishmentDetailsGCC = {
  activityType: null,
  registrationCompleted: false,
  name: null,
  fieldOfficeName: null,
  nationalityCode: null,
  establishmentType: null,
  legalEntity: null,
  registrationNo: 502351249,
  mainEstablishmentRegNo: null,
  organizationCategory: null,
  recruitmentNo: null,
  startDate: null,
  contactDetails: null,
  status: null,
  scanDocuments: [],
  comments: null,
  transactionMessage: null,
  transactionReferenceData: [],
  proactive: false,
  navigationIndicator: null,
  revisionList: [],
  validatorEdited: null,
  adminRegistered: null,
  transactionTracingId: null,
  gccEstablishment: {
    country: { english: 'Kuwait', arabic: '' },
    registrationNo: '502351249',
    gccCountry: true
  },
  license: null,
  establishmentAccount: null,
  crn: null,
  molEstablishmentIds: null,
  GosiCalendar: null,
  gccCountry: true
};

export const paymentChequeMockData = {
  receiptMode: {
    arabic: 'شيكات البنوك - ريال سعودي',
    english: 'LC Bankers Cheque'
  },
  transactionDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  referenceNo: '45678923',
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: null,
    type: 'GCC Bank',
    country: 'Kuwait'
  },
  chequeDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  chequeNumber: '455',
  description: 'okey',
  amountReceived: {
    amount: '78900',
    currency: 'KWD'
  },
  branchAmount: [
    {
      allocatedAmount: { amount: '78900', currency: 'KWD' },
      establishmentType: {
        english: 'Main',
        arabic: ''
      },
      registrationNo: 357900
    }
  ]
};

export const exchangeMockData = {
  conversionDate: {
    gregorian: '2018-01-01T00:00:00.000+03:00',
    hijri: ''
  },
  conversionType: 'Corporate',
  fromCurrency: 'SAR',
  toCurrency: 'AED',
  conversionRate: '0.10050251256281407035175879396984924623'
};

export const paymentAccountMockData = {
  receiptMode: {
    arabic: '',
    english: 'Account Transfer'
  },
  transactionDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  referenceNo: '45678923',
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: null,
    type: 'Local Bank'
  },
  chequeDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  chequeNumber: '455',
  description: 'okey',
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  branchAmount: [
    {
      allocatedAmount: { amount: '78900', currency: 'SAR' },
      establishmentType: {
        english: 'Main',
        arabic: ''
      },
      registrationNo: '357900'
    }
  ]
};

export const paymentCashMockData = {
  receiptMode: {
    arabic: '',
    english: 'Cash deposit'
  },
  transactionDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  referenceNo: '45678923',
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: null,
    type: 'Local Bank'
  },
  chequeDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  chequeNumber: '455',
  description: 'okey',
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  branchAmount: [
    {
      allocatedAmount: { amount: '78900', currency: 'SAR' },
      establishmentType: {
        english: 'Main',
        arabic: ''
      },
      registrationNo: '357900'
    }
  ]
};

export const validatorMockToken = {
  taskId: 'a08b0620-c027-41a3-9325-e1c6e42db559',
  user: 'mahesh',
  receiptNumber: 23400,
  registrationNumber: 502351249,
  resourceType: 'receive-contribution',
  assignedRole: 'VALIDATOR1',
  payload: '{"channel":"gosi-online"}'
};

export const mofReceiptMockData = {
  receiptMode: {
    arabic: '',
    english: 'Account Transfer'
  },
  transactionDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  referenceNo: '45678923',
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: null,
    type: 'Local Bank'
  },
  description: 'okey',
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  branchAmount: null
};

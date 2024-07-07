/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const paymentDetailsMockData = {
  receiptMode: {
    arabic: 'شيكات البنوك - ريال سعودي',
    english: 'Bankers Cheque'
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
    nonListedBank: 'sdfg',
    type: 'saudi'
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
      allocatedAmount: { amount: '78900', currency: 'SAR' },
      establishmentType: {
        english: 'Branch',
        arabic: ''
      },
      registrationNo: 357900,
      outsideGroup: 'false'
    }
  ],
  reasonForCancellation: {
    english: 'Other',
    arabic: ''
  },
  cancellationComments: undefined,
  status: {
    english: '',
    arabic: ''
  },
  fromJsonToObject(json) {
    return undefined;
  }
};

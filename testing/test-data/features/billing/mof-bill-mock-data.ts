/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const mofBillMockData = {
  billNumber: 13292,
  issueDate: {
    gregorian: '2019-10-31T00:00:00.000Z',
    hijiri: '1441-03-03'
  },
  balanceDue: 2856.1,
  dueDate: {
    gregorian: '2019-11-15T00:00:00.000Z',
    hijiri: '1441-03-18'
  },
  totalMOFContribution: [
    {
      type: {
        arabic: null,
        english: 'Annuity'
      },
      amount: 2142.08
    },
    {
      type: {
        arabic: null,
        english: 'oh'
      },
      amount: 476.02
    },
    {
      type: {
        arabic: null,
        english: 'ui'
      },
      amount: 238
    }
  ],
  mofEstablishmentDetails: [
    {
      establishmentName: {
        arabic: 'مركز بدر قطع غيار تبريد تكييف سيارات',
        english: null
      },
      registrationNo: 504096157,
      establishmentContribution: {
        annuity: 1126.39,
        oh: 250.31,
        ui: 125.15,
        total: 1501.85
      }
    },
    {
      establishmentName: {
        arabic: 'مخبزالذوق الرفيع',
        english: null
      },
      registrationNo: 501704164,
      establishmentContribution: {
        annuity: 1015.69,
        oh: 225.71,
        ui: 112.85,
        total: 1354.25
      }
    }
  ]
};

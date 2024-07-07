/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const InstallemntSubmitRequestMockData = {
  comments: 'aaaaaffffff',
  downPayment: 7,
  downPaymentPercentage: 10,
  outOfMarket: false,
  schedule: [
    {
      installmentMonth: { arabic: 'JAN', english: 'JAN' },
      installmentNumber: 19,
      monthlyInstallmentAmount: 100,
      paymentDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: '1442-02-14'
      },
      installmentAmountRemaining: 50,
      status: { arabic: '', english: 'New Installment' }
    }
  ],
  deathDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: '1442-02-14'
  },
  endDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: '1442-02-14'
  },
  guaranteeDetail: [
    {
      category: {
        arabic: 'الرياض',
        english: 'Promissory Note'
      },
      endDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: '1442-02-14'
      },
      deathDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: '1442-02-14'
      },
      guaranteeAmount: 10,
      guaranteeName: {
        arabic: 'الرياض',
        english: 'RIBL'
      },
      guaranteePercentage: 10,
      guarantorId: 45522,
      startDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: '1442-02-14'
      },
      type: {
        arabic: 'الرياض',
        english: 'RIBL'
      }
    }
  ],
  installmentPeriodInMonths: 10,
  lastInstallmentAmount: 20,
  monthlyInstallmentAmount: 252,
  startDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: '1442-02-14'
  },
  extendedGracePeriod: 4,
  extensionReason: 'reason',
  gracePeriod: 11,
  totalContributionDue: 10,
  totalDue: 100,
  totalInstallmentAmount: 10,
  totalPenaltyDue: 10,
  totalRejectedOh: 10,
  totalViolation: 10,
  uuid: 'gdvsidgis9sd8789s7d987ds90',
  installmentStartMonth: { english: 'test', arabic: 'test' },
  installmentEndMonth: { english: 'test', arabic: 'test' }
};

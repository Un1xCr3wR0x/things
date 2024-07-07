/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const installmentValidatorViewDeatilsMockData = {
  startDate: {
    gregorian: '2021-01-01T00:00:00.000Z',
    hijiri: '1442-05-17'
  },
  endDate: {
    gregorian: '2021-01-01T00:00:00.000Z',
    hijiri: '1442-05-17'
  },
  monthlyInstallmentAmount: 9,
  guaranteeDetail: [
    {
      type: {
        arabic: 'Provided a bank guarantee of the full dues',
        english: 'Provided a bank guarantee of the full dues'
      },
      category: {
        arabic: 'Banking',
        english: 'Banking'
      },
      guaranteePercentage: 1,
      startDate: {
        gregorian: '2021-01-01T00:00:00.000Z',
        hijiri: '1442-05-17'
      },
      endDate: {
        gregorian: '2021-01-31T00:00:00.000Z',
        hijiri: '1442-06-18'
      },
      guaranteeAmount: 10,
      guaranteeName: {
        arabic: 'البنك الأول',
        english: 'Alawwal Bank'
      },
      guarantorId: 123
    }
  ],
  lastInstallmentAmount: 9,
  downPaymentPercentage: 97,
  installmentPeriodInMonths: 1,
  totalContributionDue: 6300,
  totalPenaltyDue: 792,
  totalInstallmentAmount: 7833.6,
  totalRejectedOh: 2700,
  totalViolation: 0,
  totalDue: 9792
};

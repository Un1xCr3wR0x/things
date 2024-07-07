/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const installmentDeatilsMockData = {
  dueAmount: {
    contribution: 2700,
    penalty: 792,
    rejectedOh: 2700,
    violation: 0,
    total: 6192
  },
  eligibleForInstallment: true,
  installmentPlan: [
    {
      guaranteeDetail: [
        {
          terms: [
            {
              additionalGuarantee: {
                type: {
                  arabic: 'Down Payment',
                  english: 'Down Payment'
                },
                guaranteePercentage: 0,
                guaranteeAmount: 0,
                minGracePeriodInDays: 7,
                maxGracePeriodInDays: 7
              },
              downPaymentRequired: false,
              exceptionFromDownPayment: false,
              maxInstallmentPeriodInMonths: 0,
              maxInstallmentPeriodMonthsAfterException: 0,
              minMonthlyInstallmentAmount: 0,
              minimumDueForAllowingInstallment: 0
            }
          ]
        }
      ]
    }
  ]
};
export const installmentSummaryMockData = {
  startDate: { gregorian: '2021-04-15T13:58:15.000Z', hijiri: '1442-09-03' },
  endDate: { gregorian: '2021-04-15T13:58:15.000Z', hijiri: '1442-09-03' },
  monthlyInstallmentAmount: 2014.22,
  guaranteeDetail: [
    {
      type: {
        arabic: 'تقديم ضمان بنكي بما لا يقل عن 50% من المديونية',
        english: 'Provided a bank guarantee of at least 50% of the dues'
      },
      category: { arabic: 'ضمان بنكي', english: 'Bank Guarantee' },
      guaranteePercentage: 1,
      startDate: { gregorian: '2021-04-15T13:57:15.000Z', hijiri: '1442-09-03' },
      endDate: { gregorian: '2021-04-30T13:57:15.000Z', hijiri: '1442-09-18' },
      guaranteeAmount: 122,
      guaranteeName: { arabic: 'بنك الرياض', english: 'Riyad Bank' },
      guarantorId: 1002
    }
  ],
  lastInstallmentAmount: 2014.22,
  downPaymentPercentage: 7.3,
  installmentPeriodInMonths: 19,
  totalContributionDue: 35200,
  totalPenaltyDue: 1056,
  totalInstallmentAmount: 32630.4,
  totalRejectedOh: 0,
  totalViolation: 0,
  totalDue: 36256,
  downPayment: 2464.0,
  referenceNumber: null,
  gracePeriod: 7,
  extensionReason: null,
  extendedGracePeriod: 0,
  schedule: [
    {
      installmentNumber: 1,
      installmentMonth: { arabic: 'أبريل 2021', english: 'April 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 2,
      installmentMonth: { arabic: 'مايو 2021', english: 'May 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 3,
      installmentMonth: { arabic: 'يونيو 2021', english: 'June 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 4,
      installmentMonth: { arabic: 'يوليو 2021', english: 'July 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 5,
      installmentMonth: { arabic: 'أغسطس 2021', english: 'August 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 6,
      installmentMonth: { arabic: 'سبتمبر 2021', english: 'September 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 7,
      installmentMonth: { arabic: 'أكتوبر 2021', english: 'October 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 8,
      installmentMonth: { arabic: 'نوفمبر 2021', english: 'November 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 9,
      installmentMonth: { arabic: 'ديسمبر 2021', english: 'December 2021' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 10,
      installmentMonth: { arabic: 'يناير 2022', english: 'January 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 11,
      installmentMonth: { arabic: 'فبراير 2022', english: 'February 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 12,
      installmentMonth: { arabic: 'مارس 2022', english: 'March 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 13,
      installmentMonth: { arabic: 'أبريل 2022', english: 'April 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 14,
      installmentMonth: { arabic: 'مايو 2022', english: 'May 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 15,
      installmentMonth: { arabic: 'يونيو 2022', english: 'June 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 16,
      installmentMonth: { arabic: 'يوليو 2022', english: 'July 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 17,
      installmentMonth: { arabic: 'أغسطس 2022', english: 'August 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 18,
      installmentMonth: { arabic: 'سبتمبر 2022', english: 'September 2022' },
      monthlyInstallmentAmount: 2014.22
    },
    {
      installmentNumber: 19,
      installmentMonth: { arabic: 'أكتوبر 2022', english: 'October 2022' },
      monthlyInstallmentAmount: 2014.22
    }
  ],
  installmentAmountPaid: 0,
  installmentAmountRemaining: 0,
  nextInstallmentDate: {
    gregorian: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    hijiri: 'yyyy-MM-dd'
  },
  numberOfMonthsPaid: 0,
  numberOfMonthsRemaining: 0,
  penaltyWaiverEligible: true
};
export const activeInstallment = {
  installmentDetails: [
    {
      installmentAmountPaid: 0,
      installmentAmountRemaining: 0,
      installmentEndMonth: {
        arabic: 'string',
        english: 'string'
      },
      installmentId: 30101467,
      installmentStartMonth: {
        arabic: 'string',
        english: 'string'
      },
      status: {
        arabic: 'string',
        english: 'string'
      }
    }
  ]
};

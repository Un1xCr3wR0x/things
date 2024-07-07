/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const BackdatedTerminationTransactionDetailsMockData = {
  terminatedContributions: [
    {
      alreadyRefunded: true,
      contributorShare: 100,
      endDate: {
        gregorian: new Date('2019-12-31'),
        hijiri: ''
      },
      engagementId: 8374900,
      startDate: {
        gregorian: new Date('2019-01-01'),
        hijiri: ''
      },
      transactionDate: {
        gregorian: new Date('2019-01-01'),
        hijiri: ''
      }
    },
    {
      alreadyRefunded: false,
      contributorShare: 100,
      endDate: {
        gregorian: new Date('2020-12-31'),
        hijiri: ''
      },
      engagementId: 8374900,
      startDate: {
        gregorian: new Date('2020-01-01'),
        hijiri: ''
      },
      transactionDate: {
        gregorian: new Date('2020-01-01'),
        hijiri: ''
      }
    },
    {
      alreadyRefunded: false,
      contributorShare: 500,
      endDate: {
        gregorian: new Date('2020-10-31'),
        hijiri: ''
      },
      engagementId: 8374900,
      startDate: {
        gregorian: new Date('2020-02-01'),
        hijiri: ''
      },
      transactionDate: {
        gregorian: new Date('2020-05-01'),
        hijiri: ''
      }
    }
  ],
  totalRefundableAmount: 3000,
  isEligibleForRefund: true,
  iban: 'SA56456416546545645641'
};

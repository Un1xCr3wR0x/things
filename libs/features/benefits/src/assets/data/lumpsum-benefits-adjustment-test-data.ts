/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const lumpsumBenefitAdjustmentTestData = {
  benefitsAdjustment: [
    {
      previousTransaction: 10002110,
      adjustmentReason: {
        english: 'Wage Update',
        arabic: 'Wage Update'
      },
      type: {
        english: 'Debit',
        arabic: 'Debit'
      },
      adjustment: -450
    },
    {
      previousTransaction: 10031102,
      adjustmentReason: {
        english: 'Wage Update',
        arabic: 'Wage Update'
      },
      type: {
        english: 'Debit',
        arabic: 'Debit'
      },
      adjustment: 480
    }
  ],
  finalbenefitamount: 16800,
  totalAdjustmentAmount: -1400,
  adjustmentType: {
    english: 'Debit',
    arabic: 'Debit'
  }
};

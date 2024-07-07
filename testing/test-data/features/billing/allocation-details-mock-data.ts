/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const allocationDetailsMockData = {
  creditAdjustment: 100,
  creditAllocation: [
    {
      adjustmentForCurrent: {
        allocatedAmount: 500,
        debitAmount: 100
      },
      amountFromPreviousBill: {
        allocatedAmount: 1000,
        debitAmount: 1000
      },
      currentMonthDues: {
        allocatedAmount: 1000,
        debitAmount: 1000
      },
      type: {
        arabic: 'OH',
        english: 'OH'
      }
    }
  ],
  creditFromPrevious: 200,
  creditToAnotherEst: {
    allocatedAmount: 350,
    debitAmount: 520
  },
  incomingTransfer: 100,
  totalPayment: 250
};

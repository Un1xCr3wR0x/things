/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const cotributorAllocationDetailsMockData = {
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
  total: { debitAmount: 10, allocatedAmount: 10 },
  person: {
    name: {
      arabic: {
        firstName: 'شاورين',
        familyName: 'راتاناش'
      },
      english: {}
    },
    identity: {
      idType: 'PASSPORT',
      passportNo: 70045,
      expiryDate: null,
      issueDate: null
    },
    nationality: {
      arabic: 'تايلند ',
      english: 'Thailand'
    }
  }
};

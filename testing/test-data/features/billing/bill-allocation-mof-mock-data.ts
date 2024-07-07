/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const billAllocationMofMock = {
  thirdPartyBillAllocations: [
    {
      debitAmount: 160200,
      allocatedAmount: 63000,
      balanceAfterAllocation: 97200,
      establishmentName: {
        arabic: 'جامعه/ الطائف',
        english: 'Testnamefor MOF'
      },
      registrationNo: 500680571
    },
    {
      debitAmount: 196314,
      allocatedAmount: 89612.4,
      balanceAfterAllocation: 106701.6,
      establishmentName: {
        arabic: 'مستشفى المزاحميه',
        english: 'Testnamefor MOF'
      },
      registrationNo: 502387146
    }
  ],
  creditFromPrevious: 0,
  creditAdjustment: 0,
  totalPayment: 927771.06,
  totalNoOfEstablishments: 15,
  totalDebitAmount: 1216528.42,
  totalAllocatedAmount: 595774.26
};

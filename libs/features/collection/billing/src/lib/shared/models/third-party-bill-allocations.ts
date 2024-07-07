import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ThirdPartyBillAllocations {
  debitAmount: number = undefined;
  allocatedAmount: number = undefined;
  balanceAfterAllocation: number = undefined;
  establishmentName: BilingualText = new BilingualText();
  registrationNo: number = undefined;
}

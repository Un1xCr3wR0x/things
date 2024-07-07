/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ItemizedBillCreditAdjustmentDetails } from './itemized-bill-credit-adjustment-details';

export class ItemizedBillCreditAdjustmentWrapper {
  thirdPartyItemizedBillBreakDown: ItemizedBillCreditAdjustmentDetails[] = [];
  availableCount: number = undefined;
}

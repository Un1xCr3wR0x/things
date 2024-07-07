/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentModificationList } from '.';

export class CreateTpaRequest {
  adjustmentModificationList: AdjustmentModificationList[] = [];
  referenceNo: number;
  newMonthlyDeductionAmount?: number;
}

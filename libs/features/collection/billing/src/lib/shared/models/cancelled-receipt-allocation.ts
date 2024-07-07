/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AdjustmentForCurrent } from './adjustment-for-current';
import { BilingualText } from '@gosi-ui/core';

export class CanclledReceiptAllocation {
  adjustmentForCurrent: AdjustmentForCurrent = new AdjustmentForCurrent();
  amountFromPreviousBill: AdjustmentForCurrent = new AdjustmentForCurrent();
  currentMonthDues: AdjustmentForCurrent = new AdjustmentForCurrent();
  balanceAtClosing: number = undefined;
  type: BilingualText = new BilingualText();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CreditAllocation } from './credit-allocation';
import { AdjustmentForCurrent } from './adjustment-for-current';
import { GosiCalendar, Name } from '@gosi-ui/core';
import { CanclledReceiptAllocation } from './cancelled-receipt-allocation';

export class AllocationDetails {
  contributorName?: Name = undefined;
  closingDate?: GosiCalendar = new GosiCalendar();
  creditAdjustment?: number = undefined;
  creditAllocation?: CreditAllocation[] = [];
  creditFromPrevious?: number = undefined;
  creditToAnotherEst?: AdjustmentForCurrent = new AdjustmentForCurrent();
  creditRefund?: AdjustmentForCurrent = new AdjustmentForCurrent();
  incomingTransfer?: number = undefined;
  totalPayment?: number = undefined;
  mofEstablishment?: boolean;
  migratedBill?: boolean;
  allocationEnabledDate?: GosiCalendar = new GosiCalendar();
  ameenBillStartDate?: GosiCalendar = new GosiCalendar();
  cancelledReceiptCreditAllocation?: CanclledReceiptAllocation = new CanclledReceiptAllocation();
}

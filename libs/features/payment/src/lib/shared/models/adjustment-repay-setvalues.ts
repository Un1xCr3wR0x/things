/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AdjustmentRepaySetValues {
  personId: number;
  adjustmentRepayId: number;
  referenceNo: number;
  totalAmountToBePaid: number;
  constructor(personId: number, adjustmentRepayId: number, referenceNo: number, totalAmountToBePaid: number) {
    this.personId = personId;
    this.adjustmentRepayId = adjustmentRepayId;
    this.referenceNo = referenceNo;
    this.totalAmountToBePaid = totalAmountToBePaid;
  }
}

import { BilingualText, Lov } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ViolationFilterResponse {
  listOfStatus: Lov[];
  listOfViolationChannel: Lov[];
  listOfViolationType: Lov[];
  penaltyAmountStart: number;
  penaltyAmountEnd: number;
  paidAmountStart: number;
  paidAmountEnd: number;
  appliedPenaltyAmountStart: number;
  appliedPenaltyAmountEnd: number;
  appliedPaidAmountStart: number;
  appliedPaidAmountEnd: number;

  // minPenaltyAmount:number;
  // maxPenaltyAmount:number;
  // minPaidAmount:number;
  // maxPaidAmount:number
}

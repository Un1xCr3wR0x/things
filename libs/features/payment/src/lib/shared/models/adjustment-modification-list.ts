/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
export class AdjustmentModificationList {
  actionType: BilingualText = new BilingualText();
  adjustmentAmount: number = undefined;
  adjustmentId: number = undefined;
  adjustmentPercentage: number = undefined;
  adjustmentReason: BilingualText = new BilingualText();
  adjustmentType: BilingualText = new BilingualText();
  benefitType: BilingualText = new BilingualText();
  continuousDeduction: boolean;
  holdAdjustment: boolean;
  ibanAccountNo: string = undefined;
  ibanId: number = undefined;
  monthlyDeductionAmount: number = undefined;
  notes: string = undefined;
  payeeId: number = undefined;
  //rejectionReason: string = undefined;
  requestedBy: BilingualText = new BilingualText();
  transferMode: BilingualText = new BilingualText();
  tpa: boolean;
  caseDate: GosiCalendar = new GosiCalendar();
  caseNumber: string = undefined;
  city: BilingualText = new BilingualText();
  holdAdjustmentReason: BilingualText = new BilingualText();
  stopAdjustmentReason: BilingualText = new BilingualText();
  reactivateAdjustmentReason: BilingualText = new BilingualText();
  //bankName: BilingualText = new BilingualText();
  otherReason: string = undefined;
  statusChange?: Boolean = false;
}

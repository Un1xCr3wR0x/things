/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core/lib/models';

export class AdjustmentCalculationDetails {
  totalAdjustmentAmount: number;
  previousAdjustmentAmount: number;
  benefitAmountAfterDeduction?: number;
  netAdjustmentAmount: number;
  adjustmentDetails: AdjustmentCalcDetail[];
}

export class AdjustmentCalcDetail {
  //required?
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  amount: number;
  type: BilingualText;
  reason: BilingualText;
  //required?
  adjustmentAmount: number;
  adjustmentPercentage: number;
  adjustmentReason: BilingualText;
  adjustmentStartDate: GosiCalendar;
  adjustmentStopDate: GosiCalendar;
  adjustmentType: BilingualText;
  beneficiaryBenefitId: number;
  noOfMonths: number;
  noOfDays: number;
}

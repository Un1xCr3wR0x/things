/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class SanedRecalculation {
  adjustments: SanedAdjustments[];
  backdatedPayments: BackdatedPayment[];
  directPaymentStatus: Boolean;
  engagementId: number;
  engagementModifications: SanedEngagements[];
  hasOverlappingEngagements?: Boolean;
  modificationRefNo: number;
  netAdjustmentAmount?: number = null;
  previousAdjustmentAmount?: number;
  recalculationGroupedPeriods: RecalculationGroupedPeriod[];
  registrationNo: number;
  totalAdjustmentAmount: number;
  totalBackdatedAmount: number;
}
export class CustomDate {
  entryFormat: string;
  gregorian: Date;
  hijiri: string;
}
export class SanedAdjustments {
  adjustmentAmount: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  uiPeriodStartDate: CustomDate;
  uiPeriodStopDate: CustomDate;
  uiType: number;
  adjustmentPercentage: number;
}
export class SanedEngagements {
  endDate: CustomDate;
  months: number;
  newWage: number;
  previousWage: number;
  startDate: CustomDate;
  status: BilingualText;
}
export class BackdatedPayment {
  amount: number;
  backdatedPeriodStartDate: CustomDate;
  backdatedPeriodStopDate: CustomDate;
  uiPeriodStartDate: CustomDate;
  uiPeriodStopDate: CustomDate;
  uiType: number;
}
export class RecalculationGroupedPeriod {
  endDate: CustomDate;
  recalcPeriods: RecalcPeriod[];
  startDate: CustomDate;
}

export class RecalcPeriod {
  adjustmentAmount: number;
  adjustmentType?: BilingualText;
  endDate: CustomDate;
  period: number;
  reCalculation: Recalculation;
  revisedPeriod: number;
  revisedStatus: BilingualText;
  revisedUiType: number;
  startDate: CustomDate;
  uiType: number;
}
export class Recalculation {
  afterRecalculation: BenefitDetails;
  beforeRecalculation: BenefitDetails;
}
export class BenefitDetails {
  benefitStartDate: CustomDate;
  benefitStatus: BilingualText;
  benefitSuspendDate: CustomDate;
  benefitSuspensionReasons: BilingualText[];
  finalAverageMonthlyContributoryWage: number;
  initialMonthsBenefitAmount: number;
  reOpenDate: CustomDate;
  remainingMonthsBenefitAmount: number;
  terminationDate: CustomDate;
  totalBenefitAmount: number;
  totalUIContributionMonths: number;
  unemploymentMonths: number;
  unemploymentType: BilingualText;
}

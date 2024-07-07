/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { HoldPensionDetails } from './hold-pension-details';

export class DisabilityAssessmentDetails {
  adjustments: AdjustmentDetail[];

  directPaymentStatus: boolean;
  modificationRefNo: number;
  netAdjustmentAmount: number;
  previousAdjustmentAmount: number;
  recalculationType: string;
  registrationNo: number;
  totalAdjustmentAmount: number;

  reEmploymentDetails: undefined;

  disabilityAssessmentDetails: DisabilityAssessmentData;
}
export class AdjustmentDetail {
  adjustmentAmount: number;
  adjustmentPercentage: number;
  adjustmentReason: undefined; //bilingualtext
  adjustmentType: undefined; //bilingualtext
  benefitPeriodStartDate: undefined; //gosiCalender
  benefitPeriodStopDate: undefined; //gosiCalender
}

export class DisabilityAssessmentData {
  reCalculation: RecalculationDetail;
  assessmentDetails: AssessmentDetails;
  newBenefitDetails: NewBenefitDetail;
}

export class NewBenefitDetail {
  benefitType: BilingualText;
  amw: number;
  benefitAmount: number;
  helperAllowance: number;
  benefitStartDate: GosiCalendar;
}
export class Assessment {
  assessmentDetails?: AssessmentDetails;
  recordStatus: string;
  pension: HoldPensionDetails;
}
export class AssessmentDetails {
  assessmentId: number;
  complicationId: number;
  assessmentDate: GosiCalendar;
  nextAssessmentDate: GosiCalendar;
  disabilityDate: GosiCalendar;
  assessmentType: BilingualText;
  assessmentResult: BilingualText;
  result?: BilingualText;
  disabilityPercentage: number;
  helperRequired: boolean;
  helperNeeded: boolean;
  helperStartDate: GosiCalendar;
  description?: string;
  helperDate?: GosiCalendar;
  recordStatus?: string;
  isAssessment?: boolean;
}

export class RecalculationDetail {
  afterRecalculation: RecalculationData;
  beforeRecalculation: RecalculationData;
}
export class RecalculationData {
  benefitAmount: number;
  basicBenefitAmount: number;
  helperComponentAmount: number;
}

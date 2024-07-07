import { BilingualText } from './bilingual-text';
import { BorderNumber } from './border-number';
import { GosiCalendar } from './gosi-calendar';
import { Iqama } from './iqama';
import { NationalId } from './national-id';
import { NIN } from './nin';
import { Passport } from './passport';

export class CoreActiveBenefits {
  additionalContributionDetails: AdditionalContributionDetails;
  amount: number;
  appeal: boolean;
  benefitRequestId: number;
  benefitType: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitReason: BilingualText;
  missingDate: GosiCalendar;
  missingDateStr: string;
  dependentAmount: number;
  assessmentDetails?: Assessment;
  deathDate: GosiCalendar;
  deathDateStr: string;
  contributorAmount: number;
  heirBenefitDetails: HeirBenefitDetails[];
  finalAverageWage: number;
  paidMonths: number;
  // unbornPersonId: number;
  // unbornMotherId: number;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  status: BilingualText;
  sin: number;
  contributorSin?: number;
  nin?: number;
  waiveStartDate: GosiCalendar;
  waiveStopDate: GosiCalendar;
  notes: string;
  beneficiaryBenefitStatus: BilingualText;
  warningMessages?: Array<BilingualText>;

  constructor(sin: number, reqId: number, type: BilingualText, referenceNo: number) {
    this.sin = sin;
    this.benefitRequestId = reqId;
    this.benefitType = type;
    this.referenceNo = referenceNo;
  }

  setBenefitStartDate?(date: GosiCalendar) {
    this.benefitStartDate = date;
  }
}
export interface AdditionalContributionDetails {
  additionalContributionAmount: number;
  contributionPlans: ContributionPlan[];
  additionalContributionMonths: number;
  deductionAmount: number;
  deductionPercent: number;
  endDate: GosiCalendar;
  paymentAmount: number;
  recoveryPeriodMonths: number;
  startDate: GosiCalendar;
}
export interface ContributionPlan {
  deductionAmount: number;
  deductionPercentage: number;
  recoveryPeriodMonths: number;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  paymentAmount: number;
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
  disabledIdentifier?: Array<NIN | Iqama | NationalId | Passport | BorderNumber>;
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
export class HoldPensionDetails {
  annuityBenefitType: BilingualText;
  benefitAmount: number;
  benefitStartDate: GosiCalendar;
  dependantAmount: number;
  finalAverageWage: number;
  helperAllowance: number;
  injuryDate: GosiCalendar;
  injuryId: number;
  status: BilingualText;
  totalBenefitAmount: number;
}
export interface HeirBenefitDetails {
  adjustmentCalculationDetails?: AdjustmentCalculationDetails;
  benefitAmount: number;
  identifier: number;
  name: BilingualText;
  payeeType: BilingualText;
  paymentMode: BilingualText;
  relationship: BilingualText;
  lastPaidDate: GosiCalendar;
  status: BilingualText;
  amountBeforeUpdate: number;
  adjustmentAmount?: number;
  marriageGrant: number;
  personId: number;
  benefitAmountAfterDeduction?: number;
}
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
}
export class EngagementInformation {
  overallEngagements: Engagements[];
}
export class Engagements {
  engagementId: number;
  engagementType: string;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class BenefitRecalculation {
  adjustments: RecalculationAdjustment[];
  directPaymentStatus: boolean;
  engagementId?: number;
  engagementModifications: EngagementModification[];
  hasOverlappingEngagements: boolean;
  heirRecalculationDetails: HeirRecalculationDetails;
  modificationRefNo?: number;
  netAdjustmentAmount: number;
  newBenefitDetails?: NewBenefitDetails;
  nonOccRecalculationDetails?: DisabilityRecalculationDetails;
  occRecalculationDetails?: DisabilityRecalculationDetails;
  previousAdjustmentAmount: number;
  reCalculation: Recalculation;
  reEmploymentDetails?: ReEmploymentDetails;
  registrationNo?: number;
  terminationDetails?: ReEmploymentDetails;
  modifyOwnerDetails?: ModifyDetails;
  recalculationType?: string;
  totalAdjustmentAmount?: number;
}
export class RecalculationAdjustment {
  adjustmentAmount: number;
  adjustmentPercentage: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  benefitPeriodStartDate: GosiCalendar;
  benefitPeriodStopDate: GosiCalendar;
  periodId?: string;
}
export class RecalculationAssessment {
  assessmentDate: GosiCalendar;
  assessmentId: number;
  assessmentResult: BilingualText;
  assessmentType: BilingualText;
  complicationId?: number;
  disabilityDate: GosiCalendar;
  disabilityPercentage?: number;
  helperRequired: Boolean;
  helperStartDate?: GosiCalendar;
  helperStopDate: GosiCalendar;
  nextAssessmentDate: GosiCalendar;
}
export class ReEmploymentDetails {
  periods: Period[];
}

export class Period {
  adjustmentAmount: number;
  endDate: GosiCalendar;
  monthlyWage: number;
  months: number;
  periodId?: string;
  periodStatus?: BilingualText;
  reCalculation: ReCalculationPeriod;
  startDate: GosiCalendar;
}
export class ReCalculationPeriod {
  afterRecalculation: RecalculationPeriodDetails;
  beforeRecalculation: RecalculationPeriodDetails;
}
export class RecalculationPeriodDetails {
  amw: number;
  benefitAmount: number;
  basicBenefitAmount?: number;
  benefitEndDate: GosiCalendar;
  benefitStartDate: GosiCalendar;
  dependentComponentAmount: number;
  helperComponentAmount?: number;
  totalContributionMonths: number;
}
export class EngagementModification {
  endDate: GosiCalendar;
  months: number;
  newWage: number;
  previousWage: number;
  startDate: GosiCalendar;
  status: BilingualText;
}
export class Recalculation {
  afterRecalculation: RecalculationDetails;
  beforeRecalculation: RecalculationDetails;
}
export class RecalculationDetails {
  amw: number;
  basicBenefitAmount?: number;
  benefitAmount: number;
  benefitEndDate: GosiCalendar;
  benefitStartDate: GosiCalendar;
  deathGrantAmount?: number;
  dependentComponentAmount: number;
  helperComponentAmount: number;
  marriageGrantAmount?: number;
  monthlyWage?: number;
  totalContributionMonths: number;
}
export class NewBenefitDetails {
  benefitConversionType?: string;
  pensionToLumpsum?: BenefitTypeDetails;
  benefitAmount?: number;
  lumpsumToPension?: LumpsumToPensionDetails;
  revisedBenefitTypes?: string[];
}
export class BenefitTypeDetails {
  benefitAmount?: number;
  benefitType?: BilingualText;
  amw?: number;
  benefitStartDate?: GosiCalendar;
  totalContributionMonths?: number;
}
export class LumpsumToPensionDetails {
  adjustmentDetails?: AdjustmentData;
  amw?: number;
  benefitType?: BilingualText;
  paymentDetails?: PaymentData;
  pensionAmount?: number;
  requestDate?: GosiCalendar;
  totalContributionMonths?: number;
}
export class AdjustmentData {
  additionalContribution?: AdditionalContribution;
  netAdjustmentAmount?: number;
  returnAmount?: number;
  adjustmentPercentage?: number;
  adjustmentReasons?: BilingualText[];
}
export class PaymentData {
  bankName?: BilingualText;
  iban?: string;
  payeeType?: BilingualText;
  paymentMethod?: BilingualText;
}
export class AdditionalContribution {
  additionalContributionAmount?: number;
  additionalContributionMonths?: number;
  deductionAmount?: number;
  deductionPercent?: number;
  endDate?: GosiCalendar;
  paymentAmount?: number;
  recoveryPeriodMonths?: number;
  startDate?: GosiCalendar;
}
export class ModifyDetails {
  modificationType?: BilingualText;
  startDate?: GosiCalendar;
  endDate?: GosiCalendar;
  months?: number;
}
export class DisabilityRecalculationDetails {
  assessmentDetails?: RecalculationAssessment;
  benefitTypeChangeEligibility?: Boolean;
  newBenefitDetails?: BenefitTypeDetails;
  reCalculation?: Recalculation;
}
export class SwitchTitle {
  title1: string;
  title2: string;
}
export class HeirDetails {
  activeStatus?: BilingualText;
  benefitRequestDate?: GosiCalendar;
  benefitShare?: number;
  benefitStartDate?: GosiCalendar;
  benefitStopDate?: GosiCalendar;
  lastPaymentDate?: GosiCalendar;
  name?: NameBilingual;
  reasonForStop?: BilingualText;
  reCalculation?: Recalculation;
  relationship?: BilingualText;
}
export class NameBilingual {
  arabic: {
    familyName: string;
    firstName: string;
    secondName: string;
    thirdName: string;
  };
  english: {
    name: string;
  };
}
export class HeirRecalculationDetails {
  benefitPeriods?: HeirBenefitPeriods[];
  heirDetails?: HeirDetails[];
  benefitTypeChangeEligibility: boolean;
  heirBenefitDetails?: HeirCalculationDetails;
  netAdjustmentDetails?: HeirAdjustmentDetails[];
  newBenefitDetails?: HeirNewBenefits;
}
export class HeirBenefitPeriods {
  endDate: GosiCalendar;
  heirRecalculationDetails?: HeirDetails[];
  months: number;
  otherBenefitDetails?: OtherBenefitDetails;
  percentage: number;
  startDate: GosiCalendar;
  totalAmount: number;
}
export class OtherBenefitDetails {
  benefitRequestId?: number;
  benefitType?: string;
  sin?: number;
}
export class HeirAdjustmentDetails {
  adjustments: RecalculationAdjustment[];
  directPaymentStatus = false;
  name: NameBilingual;
  netAdjustmentAmount: number;
  personId?: number;
  previousAdjustmentAmount: number;
  relationship?: BilingualText;
  totalAdjustmentAmount: number;
}
export class HeirNewBenefits {
  amw: number;
  benefitAmount: number;
  benefitType: BilingualText;
  contributionMonths: number;
}
export class HeirCalculationDetails {
  benefitStartDate: GosiCalendar;
  benefitType: BilingualText;
  lastPaymentDate: GosiCalendar;
  reCalculation: RecalculationDetails;
}
export class DirectPayment {
  directPayment: boolean;
  personId: number;
}

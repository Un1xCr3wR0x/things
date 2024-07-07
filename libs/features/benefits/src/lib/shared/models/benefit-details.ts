/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, CoreActiveBenefits, GosiCalendar } from '@gosi-ui/core';
import { AverageMonthlyWagePeriod } from './average-monthlywage-period';
import { BenefitCalculationGuide } from './benefit-calculation-guide';
import { MonthsDetails } from './months-details';
import { EligibilityMonths } from './eligibility-months';
import { RestartHoldDetails } from './restart-hold-details';
import { AdditionalContributionDetails } from './additional-contribution-details';
import { HeirBenefitDetails } from './heir-benefit-details';
import { AdjustmentCalculationDetails } from './adjustment-calculation-details';
import { Ineligibility } from './ineligibility';
import { Recalculation } from './saned-benefit';

export class BenefitDetails extends CoreActiveBenefits {
  additionalContribution: AdditionalContributionDetails;
  availedMonths: number;
  averageMonthlyContributoryWage: number;
  finalAverageWage: number;
  adjustmentCalculationDetails: AdjustmentCalculationDetails;
  adjustments?: Adjustments[];
  totalAdjustmentAmount?: number;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  oldAverageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  calculationGuides: BenefitCalculationGuide;
  heirBenefitDetails: HeirBenefitDetails[];
  daysAfterTermination: number;
  initialAmount: number;
  initialMonths: MonthsDetails;
  noOfEligibleMonths: number;
  remainingMonths: MonthsDetails;
  totalBenefitAmount: number;
  calculatedBenefitAmount: number;
  totalContributionMonths: number;
  isReopen: boolean;
  eligibleMonths: EligibilityMonths[];
  helperAllowance: number;
  contributorAmount: number;
  dependentAmount: number;
  amount: number;
  benefitStartDate: GosiCalendar;
  benefitStopDate: GosiCalendar;
  benefitReason: BilingualText;
  missingDate: GosiCalendar;
  deathDate: GosiCalendar;
  beneficiaryBenefitStatus: BilingualText;
  funeralGrantAmount?: number;
  previousAdjustmentAmount?: number;
  basicBenefitAmount?: number;
  reCalculationDetails?: ReCalculationDetails[];
  requestDate: GosiCalendar;
  benefitType: BilingualText;
  missingDateStr: string;
  status: BilingualText;
  ineligibility?: Ineligibility[] = [];
  disabilityPercentage: number;
  holdStopDetails?: RestartHoldDetails = new RestartHoldDetails();
  eligibleHeirsPresent: boolean;
  uiEligibilityPeriods?: UIEligiblePeriods;
  stopDate?: GosiCalendar;
  reasonForStop?: BilingualText;
  suspensionDate?: GosiCalendar;
  reasonForSuspension?: BilingualText;
  reCalculation: Recalculation = new Recalculation();
  beneficiaryBenType?: number;
  wageAverageAtRetirementTimeEntered?: number;
  benefitAmount?: number;
  contributionMonths?: number;
  isPpaOhDeath?: boolean;
  directPaymentDeclaration?: boolean;

  constructor() {
    super(undefined, undefined, undefined, undefined);
  }
}
export class ReCalculationDetails {
  adjustmentCalculationDetails: AdjustmentCalculationDetails;
  averageMonthlyWage: number;
  basicBenefitAmount: number;
  basicBenefitBeforeRaising: number;
  beneficiaryBenefitId: BilingualText;
  benefitStopped: boolean;
  deathGrant: number;
  dependentAmount: number;
  endDate: GosiCalendar;
  heirBenefitDetails: HeirBenefitDetails[];
  helperAllowance: number;
  monthlyContributoryWage: number;
  raisedBasicBenefitAmount: number;
  startDate: GosiCalendar;
  totalBenefitAmount: number;
}
export class UIEligiblePeriods {
  periodStartDate?: string;
  periodStopDate?: string;
}
export class Adjustments {
  adjustmentAmount: number;
  adjustmentPercentage: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  uiPeriodStartDate: GosiCalendar;
  uiPeriodStopDate: GosiCalendar;
  uiType: number;
}

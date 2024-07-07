/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdditionalContributionDetails } from './additional-contribution-details';
import { HeirBenefitDetails } from './heir-benefit-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdjustmentCalculationDetails } from './adjustment-calculation-details';
import { Ineligibility } from './ineligibility';
import { AverageMonthlyWagePeriod } from './average-monthlywage-period';
import { BenefitCalculationGuide } from './benefit-calculation-guide';
import { MonthsDetails } from './months-details';
import { EligibilityMonths } from './eligibility-months';
import { RestartHoldDetails } from './restart-hold-details';

export class BenefitDetails {
  additionalContribution: AdditionalContributionDetails;
  availedMonths: number;
  averageMonthlyContributoryWage: number;
  finalAverageWage: number;
  adjustmentCalculationDetails: AdjustmentCalculationDetails;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  calculationGuides: BenefitCalculationGuide;
  heirBenefitDetails: HeirBenefitDetails[];
  daysAfterTermination: number;
  initialMonths: MonthsDetails;
  noOfEligibleMonths: number;
  remainingMonths: MonthsDetails;
  totalBenefitAmount: number;
  totalContributionMonths: number;
  isReopen: boolean;
  eligibleMonths: EligibilityMonths[];
  helperAllowance: number;
  contributorAmount: number;
  dependentAmount: number;
  amount: number;
  benefitStartDate: GosiCalendar;
  benefitReason: BilingualText;
  missingDate: GosiCalendar;
  deathDate: GosiCalendar;
  beneficiaryBenefitStatus: BilingualText;
  funeralGrantAmount?: number;
  previousAdjustmentAmount?: number;
  basicBenefitAmount?: number;
  requestDate: GosiCalendar;
  benefitType: BilingualText;
  missingDateStr: string;
  status: BilingualText;
  ineligibility?: Ineligibility[] = [];
  disabilityPercentage: number;
  holdStopDetails?: RestartHoldDetails = new RestartHoldDetails();
}

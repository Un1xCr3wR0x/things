import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CancelledEngDuration } from './cancelled-engagement-duration';
import { ContributionInfo } from './contribution-info';
import { InjuryDetails } from './injury-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EngagementDetails {
  engagementId: number;
  joiningDate: GosiCalendar;
  terminationDate: GosiCalendar;
  cancelledEngDuration: CancelledEngDuration;
  changeTerminationReasonTransaction: number;
  oldJoiningDate: GosiCalendar;
  updatedJoiningDate: GosiCalendar;
  oldTerminationDate: GosiCalendar;
  updatedTerminationDate: GosiCalendar;
  oldTerminationReason: string;
  updatedTerminationReason: string;
  oldWage: number;
  updatedWage: number;
  triggerTransactionId: number;
  isWageCorrected: boolean;
  isGracePeriodExceeded: boolean;
  contributionInfo: ContributionInfo;
  joinMonthSaudiContributorCount: number = undefined;
  isViolationHappenedBeforeFiveYears: BilingualText;
  requestSubmissionDate: GosiCalendar;
  violationDesc: BilingualText;
  cancelledEngDurationEndDateGregorian?: String;
  cancelledEngDurationStartDateGregorian?: String;
  isEngagementFullyCanceled?: BilingualText = new BilingualText();
  isBenefitsEffected?: BilingualText;
  isBackdated?: BilingualText = new BilingualText();
  cancelledDurationStartDate?: GosiCalendar;
  cancelledDurationEndDate?: GosiCalendar;
  contributionAmount: number;
  engagementPeriodDays: number;
  engagementPeriodMonth: number;
  terminationReason?: BilingualText = new BilingualText();
  injuryDetails?: InjuryDetails[];
}

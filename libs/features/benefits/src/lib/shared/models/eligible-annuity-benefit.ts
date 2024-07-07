/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { ImprisonmentPeriod } from './imprisonment-periods';
import { EligibilityRule } from './eligibility-rule';

export class EligibleAnnuityBenefit {
  benefitGroup: BilingualText;
  benefitId: number;
  benefitType: BilingualText;
  eligibilityRules: EligibilityRule[];
  deathDate: GosiCalendar;
  eligible: boolean;
  endDate: GosiCalendar;
  failedEligibilityRules: number;
  heirBenefitRequestReason: BilingualText;
  jailedPeriods: ImprisonmentPeriod;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  status: string;
  totalEligibilityRules: number;
  warningMessages: BilingualText[];
}

// export interface SearchPerson {
//   isSudi: boolean;
//   nationalId: number;
//   gccId: number;
//   iqamaNo: number;
//   passportNo: string;
//   dob: CalendarTypeHijiriGregorian;
//   calendarType: string;
// }

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Benefits {
  lateRequest: boolean;
  benefitId: number;
  benefitType: BilingualText;
  benefitGroup: BilingualText;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  status: string;
  eligibilityRules: EligibilityResponse[];
  failedEligibilityRules: number;
  totalEligibilityRules: number;
  applicable?: boolean;
  eligible: boolean;
  appeal: boolean;
  // jailedPeriods: ImprisonmentDetails[];
  deathDate: GosiCalendar;
  missingDate: GosiCalendar;
  heirBenefitRequestReason: BilingualText;
  warningMessages: BilingualText[];
  eligiblePeriods: EligiblePeriods[];
  eligibleForDependentAmount: boolean;
  eligibleForVicCancellation: boolean;
  refundVicContribution: boolean;
  amount?: Number;
  applyBefore?: GosiCalendar;
}

export interface EligibilityResponse {
  message: BilingualText;
  eligible: boolean;
  subMessages?: BilingualText;
}

export interface EligiblePeriods {
  endDate: GosiCalendar;
  startDate: GosiCalendar;
}

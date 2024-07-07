/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

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

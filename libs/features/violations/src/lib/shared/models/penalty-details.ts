import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { ExcludedContributors } from './excluded-contributors';
import { ViolatedContributor } from './violated-contributor';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PenaltyDetails {
  dateOfModification: GosiCalendar;
  decisionBy: string;
  memberId: string;
  establishmentProactiveAction: boolean;
  excludedContributors: ExcludedContributors[];
  justification: string;
  penaltyAmount: number;
  role:  BilingualText = new BilingualText();
  selectedViolationClass: BilingualText = new BilingualText();
  violatedContributors: ViolatedContributor[];
  penaltyCalculationEquation: BilingualText = new BilingualText();
}

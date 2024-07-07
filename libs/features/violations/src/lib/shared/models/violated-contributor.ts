import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ViolatedContributor {
  compensated: boolean;
  contributionAmount: number;
  contributorId: number;
  contributorName: BilingualText;
  violationAmount: number;
  repetitionTierType?: BilingualText;
  penaltyCalculationEquation?: BilingualText;
  totalBenefitAmount: number;
}

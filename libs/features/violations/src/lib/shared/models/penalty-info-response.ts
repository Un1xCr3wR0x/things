import { BilingualText } from '@gosi-ui/core';
import { ContributorViolationAmount } from './contributor-violation-amount';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PenaltyInfoResponse {
  contributorViolationAmountDetails: ContributorViolationAmount[];
  establishmentViolationAmount: number;
  violationClass: BilingualText = new BilingualText();
  penaltyCalculationEquation: BilingualText;
}

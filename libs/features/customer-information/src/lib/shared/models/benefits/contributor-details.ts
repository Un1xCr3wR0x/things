/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { EligibleAnnuityBenefit } from './eligible-annuity-benefit';

export class ContributorDetails {
  eligibility: EligibleAnnuityBenefit;
  name: BilingualText;
  sin: number;
}

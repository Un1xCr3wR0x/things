/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class ContributionDetails {
  contributionAmount: number = undefined;
  productType: BilingualText = new BilingualText();
  noOfContributor: number = undefined;
  totalContributorsWage: number = undefined;
  deductionRate: number = undefined;
}

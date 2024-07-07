/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributionDetails } from './contribution-details';
import { ContributionProductBreakups } from './contribution-product-breakup';

export class ContributionBreakup {
  contributionProductBreakups: ContributionProductBreakups[]=[];
  contributionDetails: ContributionDetails[] = [];
  totalNoOfSaudi: number = undefined;
  totalNoOfNonSaudi: number = undefined;
  totalNoOfContributors: number = undefined;
  totalNoOfEstablishments: number = undefined;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributionDetails } from './contribution-details';

export class ContributionBreakup {
  contributionDetails: ContributionDetails[] = [];
  totalNoOfSaudi: number = undefined;
  totalNoOfNonSaudi: number = undefined;
  totalNoOfContributors: number = undefined;
  totalNoOfEstablishments: number = undefined;
}

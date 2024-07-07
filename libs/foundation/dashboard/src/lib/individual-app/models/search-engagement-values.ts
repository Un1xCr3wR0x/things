/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EngagementDetails } from './engagement-details';

/**
 * Wrapper class for search contributor api response
 */
export class SearchEngagementValues {
  age?: number;
  activeEngagements: EngagementDetails[] = [];
  overallEngagements: EngagementDetails[] = [];
  totalContributionDays?: number;
  totalRPAContributionMonths?: number;
  totalVicContributionDays?: number;
  pendingContractsCount?: number;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ViolatedContributorsList } from './violated-contributor-list';
import { ViolationSummary } from './violation-summary';

export class DetailedBillViolationDetails {
  summary: ViolationSummary[];
  violatedContributorsList: ViolatedContributorsList[];
  violatedContributorsCountAggregate: number;
  totalViolationAmountAggregate: number;
}

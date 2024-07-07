/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { EngagementSummary } from './engagement-summary';
import { ModifyCoverageDetails } from './modify-coverage-details';
import { UpdatedPeriodDetails } from './updated-period-details';

export class UpdatedWageDetails {
  basicDetails: EngagementSummary = new EngagementSummary();
  changeInJoiningOrLeavingData: boolean = undefined;
  penaltyIndicator: number = undefined;
  transactionRefNo: number = undefined;
  wagePeriods: UpdatedPeriodDetails[] = [];
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  docFetchTypes: string[] = [];
  engagementStatus: string = undefined;
  changeRequestTypes: string[] = [];
  details?: ModifyCoverageDetails[] = [];
}

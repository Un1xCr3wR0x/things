/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { ModifyCoverageDetails } from './modify-coverage-details';

export class UpdateModifyCoverage {
  penaltyIndicator: number = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  engagementStatus: string = undefined;
  transactionRefNo: number = undefined;
  changeRequestTypes: string[] = [];
  contributorAbroad = false;
  details: ModifyCoverageDetails[] = [];
  docFetchTypes: string[] = [];
}

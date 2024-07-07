/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class SelectedTerminationPeriodDetails {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  contributorShare: number = undefined;
  transactionDate: GosiCalendar = new GosiCalendar();
}

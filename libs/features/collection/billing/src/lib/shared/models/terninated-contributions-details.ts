/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class TerminatedContributionsDetails {
  alreadyRefunded: boolean = undefined;
  contributorShare: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  transactionDate: GosiCalendar = new GosiCalendar();
}

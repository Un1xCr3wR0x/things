/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

/**
 * The wrapper class for engagement period details.
 * @export
 * @class EngagementPeriod
 */

export class EngagementPeriod {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  suggestedStartDate: Date = undefined;
  selectedStartDate: Date = undefined;
}

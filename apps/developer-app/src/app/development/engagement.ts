/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';
import { EngagementCalendarYear } from './engagement-calendar-year';

/**
 * The wrapper class for engagement period details.
 *
 * @export
 * @class EngagementDetails
 */
export class Engagement {
  engagementId: number = undefined;
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  changeableStartDate: Date = undefined;
  changeableEndDate: Date = undefined;
  isPersonDeceased = false;
  changeableYears: EngagementCalendarYear[] = [];
  engagementPeriod: EngagementPeriod[] = [];
  selectedPeriod: EngagementPeriod = undefined;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { violationPeriodRequest } from './violationPeriod-Request';

export class EngagementBasicDetails {
  employeeID?: string = undefined;
  workType?: BilingualText = new BilingualText();
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  violationSubType?: string = undefined;
  violationType?: string = undefined;
  comments?: string = undefined;
  wageViolationId?: number = undefined;
  violationPeriodRequests?: violationPeriodRequest[]=[];
  requestId?: any;
}

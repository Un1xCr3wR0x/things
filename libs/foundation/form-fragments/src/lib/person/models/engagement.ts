/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * The wrapper class for engagement period details.
 *
 * @export
 * @class EngagementDetails
 */
export class EngagementDetails {
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  occupation: BilingualText = new BilingualText();
  status: number = undefined;
}

import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold push notification details.
 *
 * @export
 * @class Notification
 */
export class Notification {
  title: BilingualText = new BilingualText();
  body?: BilingualText = new BilingualText();
  timestamp: GosiCalendar = new GosiCalendar();
  icon?: string = undefined;
  redirectUrl?: string = undefined;
  id?: string = undefined;
  number?: number = undefined;
}

export class NotificationCount {
  unViewedCount: number;
  totalCount: number;
}

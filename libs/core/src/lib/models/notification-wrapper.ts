/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NotificationResponse } from '../models';
export class NotificationWrapper {
  notificationEntries: NotificationResponse[] = [];
  unViewedCount: number = undefined;
  totalCount: number = undefined;
}

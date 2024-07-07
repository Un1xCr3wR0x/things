/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NotificationLimit } from '.';
import { NotificationFilter } from './notification-filter';
import { NotificationSearch } from './notification-search';
import { NotificationSort } from './notification-sort';

export class NotificationRequest {
  filter: NotificationFilter;
  page: NotificationLimit;
  sort: NotificationSort;
  search: NotificationSearch;
  personIdentifier?: number;
}

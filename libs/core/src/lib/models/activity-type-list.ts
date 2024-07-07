/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ActivityType } from '../models';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 */
export class ActivityTypeList {
  items: ActivityType[];
  /**
   * Creates an instance of ActivityTypeList
   * @param items
   * @memberof  ActivityTypeList
   */
  constructor(items: ActivityType[]) {
    this.items = items;
  }
}

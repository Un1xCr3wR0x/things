import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class FilterKeyValue {
  maxAmount: string = undefined;
  minAmount: string = undefined;
  endDate: string = undefined;
  startDate: string = undefined;
  type: BilingualText[];
  constructor() {}
  /**
   * mapping values into model
   */
  fromJsonToObject?(json: FilterKeyValue) {
    Object.keys(json).forEach(key => {
      if (key in new FilterKeyValue()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

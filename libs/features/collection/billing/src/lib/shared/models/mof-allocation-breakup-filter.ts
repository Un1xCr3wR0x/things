import { FilterDate } from './filter-date';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class MofAllocationBreakupFilter {
  allocationDate: FilterDate = new FilterDate();
  maxAmount: number = undefined;
  minAmount: number = undefined;

  fromJsonToObject(json) {
    Object.keys(new MofAllocationBreakupFilter()).forEach(key => {
      this[key] = json[key];
    });
    return this;
  }
}

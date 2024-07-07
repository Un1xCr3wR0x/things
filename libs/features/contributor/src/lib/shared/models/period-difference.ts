/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PeriodDifference {
  noOfMonths: number = undefined;
  noOfDays: number = undefined;
  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      this[key] = json[key];
    });
    return this;
  }
}

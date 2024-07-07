/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold only wage values.
 *
 * @export
 * @class wageInfo
 */
export class WageInfo {
  basicWage = 0;
  commission = 0;
  housingBenefit = 0;
  otherAllowance = 0;
  totalWage = 0;
  contributoryWage = 0;

  fromJsonToObject(json: WageInfo) {
    Object.keys(json).forEach(key => {
      if (key in new WageInfo()) {
        this[key] = parseFloat(json[key]).toFixed(2);
      }
    });
    return this;
  }
}

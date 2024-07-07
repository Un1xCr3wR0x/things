/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';

/**
 * Wrapper class to hold only wage values.
 *
 * @export
 * @class wageInfo
 */
export class WageInfo {
  basicWage: number = undefined;
  commission: number = undefined;
  housingBenefit: number = undefined;
  otherAllowance: number = undefined;
  totalWage?: number = undefined;
  contributoryWage?: number = undefined;
  wageCategory?: number = undefined;
  transportationAllowance?: number = undefined; //Added for unified contract.
  occupation?: BilingualText = new BilingualText();
  grade?: BilingualText = new BilingualText();
  rank?: BilingualText = new BilingualText();
  jobClass?: BilingualText = new BilingualText();

  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new WageInfo()) {
        this[key] = parseFloat(json[key]).toFixed(2);
      }
    });
    return this;
  }
}

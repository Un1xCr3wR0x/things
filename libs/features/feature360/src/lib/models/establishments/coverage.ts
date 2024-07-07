/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

/**
 * The wrapper class for product.
 * @export
 * @class Coverage
 */
export class Coverage {
  coverage = 0;
  coverageType: BilingualText = new BilingualText();
  contributorPercentage = 0;
  contributorShare = 0;
  establishmentPercentage = 0;
  establishmentShare = 0;

  fromJsonToObject(json: Coverage) {
    Object.keys(json).forEach(key => {
      if (key in new Coverage()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

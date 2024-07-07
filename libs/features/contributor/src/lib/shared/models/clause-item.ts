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
export class ClauseItem {
  id = 0;
  order = '1';
  isOptional = false;
  isChecked? = false;
  description: BilingualText = new BilingualText();

  constructor() {}

  fromJsonToObject(json: ClauseItem) {
    Object.keys(json).forEach(key => {
      if (key in new ClauseItem()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
export class OptionalClausesItem {
  description: BilingualText = new BilingualText();
}

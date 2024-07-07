/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AmountDetails {
  amount: number = undefined;
  currency: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new AmountDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

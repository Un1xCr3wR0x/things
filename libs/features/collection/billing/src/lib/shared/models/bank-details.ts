/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class BankDetails {
  country: BilingualText = new BilingualText();
  name: BilingualText = new BilingualText();
  nonListedBank: string = undefined;
  type: BilingualText = new BilingualText();

  fromJsonToObject(json) {
    Object.keys(new BankDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

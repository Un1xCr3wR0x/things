/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class BankAccountDetails {
  bankName: BilingualText = new BilingualText();
  ibanAccountNo: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new BankAccountDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

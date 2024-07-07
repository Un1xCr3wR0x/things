/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class MiscellaneousResponse {
  miscRecordId: number;
  message: BilingualText = new BilingualText();

  fromJsonToObject(json) {
    Object.keys(new MiscellaneousResponse()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

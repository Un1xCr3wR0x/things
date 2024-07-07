/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Contract {
  id: number = undefined;
  establishmentRegNo: number = undefined;
  establishmentName: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  status: string = undefined;
  type: string = undefined;
  wageType: string = undefined;
  approvalDate: GosiCalendar = new GosiCalendar();
  approvedBy: string = undefined;

  constructor() {}

  fromJsonToObject(json) {
    Object.keys(this).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

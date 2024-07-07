/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AmountDetails } from './amount-details';

export class BranchBreakup {
  allocatedAmount: AmountDetails = new AmountDetails();
  establishmentType: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  name: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  fieldOffice: BilingualText = new BilingualText();
  outsideGroup: Boolean = false;
  allocationDate: GosiCalendar = new GosiCalendar();

  fromJsonToObject(json) {
    Object.keys(new BranchBreakup()).forEach(key => {
      if (key in json) {
        if (key === 'allocatedAmount') {
          this[key] = new AmountDetails().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      } else this[key] = undefined;
    });
    return this;
  }
}

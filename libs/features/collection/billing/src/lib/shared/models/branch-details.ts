/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AmountDetails } from './amount-details';

export class BranchDetails {
  registrationNo: number = undefined;
  name: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  allocatedAmount?: AmountDetails = new AmountDetails();
  fieldOffice: BilingualText = new BilingualText();
  selectedCheckBox?: Boolean = false;

  fromJsonToObject(json) {
    Object.keys(new BranchDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

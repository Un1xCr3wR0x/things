/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class BranchDetails {
  registrationNo: number = undefined;
  name: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  fieldOffice: BilingualText = new BilingualText();
}

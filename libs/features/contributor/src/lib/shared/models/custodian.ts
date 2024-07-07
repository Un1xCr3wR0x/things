/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Custodian {
  id: number;
  fullName: string;
  sex: string;
  nationality: BilingualText = new BilingualText();
  dateOfBirth: GosiCalendar = new GosiCalendar();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, BorderNumber, GosiCalendar, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';

export class Contributor {
  age: number;
  hijiriAge: number;
  dateOfBirth: GosiCalendar;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: BilingualText;
}

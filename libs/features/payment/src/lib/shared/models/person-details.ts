/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';
import { Identity } from './identity';

export class PersonDetails {
  // identity: Identity[];
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  birthDate: GosiCalendar;
  name: BilingualText = new BilingualText();
  nameBilingual: BilingualText;
  age: Number;
  personId?: Number;
  hijiriAge?: Number;
}

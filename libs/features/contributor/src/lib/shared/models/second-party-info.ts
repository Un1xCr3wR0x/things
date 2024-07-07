/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  BilingualText,
  BorderNumber,
  ContactDetails,
  GosiCalendar,
  Iqama,
  Name,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';

export class SecondPartyInfo {
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sex: BilingualText = new BilingualText();
  maritalStatus: BilingualText = new BilingualText();
  birthDate: GosiCalendar = new GosiCalendar();
  contactDetail: ContactDetails = new ContactDetails();
}

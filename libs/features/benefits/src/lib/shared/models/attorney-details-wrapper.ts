/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AttorneyDetails } from './attorney-details';
import { GosiCalendar, NIN, Iqama, NationalId, Passport, BorderNumber, BilingualText, Name } from '@gosi-ui/core';

export class AttorneyDetailsWrapper {
  attorneyDetails: AttorneyDetails;
  birthDate: GosiCalendar;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: Name = new Name();
  nationality: BilingualText;
  nameBilingual: BilingualText;
  personId: number;
  sex: BilingualText;
  authorizationId: number;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

export class PersonId {
  personIdentifier: number = undefined;
  idType: NIN | Iqama | NationalId | Passport | BorderNumber;
  nationality: BilingualText = undefined;
}

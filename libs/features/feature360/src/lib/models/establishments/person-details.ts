/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, Name, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

export class PersonDetails {
  name: Name = undefined;
  identity: NIN | Iqama | NationalId | Passport | BorderNumber;
  nationality: BilingualText = undefined;
  sin: number = undefined;
}

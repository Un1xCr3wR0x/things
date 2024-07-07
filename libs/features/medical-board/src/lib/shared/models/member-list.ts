import { BilingualText, Name, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MbList {
  doctorType: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  idType?: string;
  name: Name = new Name();
  region: BilingualText[];
  specialty: BilingualText;
  status: BilingualText;
  mobileNo?: string = undefined;
  fee?: number;
  nameOfTheMedicalProvider?: string = undefined;
  contractId?: number;
  mbProfessionId?: number;
}

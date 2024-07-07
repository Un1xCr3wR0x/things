/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, Iqama, Name, NationalId, NIN, Passport } from '@gosi-ui/core';
import { PersonalInformation } from '@gosi-ui/features/contributor';

export class MedicalInsuranceContributorDto {
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  person: PersonalInformation = new PersonalInformation();
  socialInsuranceNo: number = undefined;
  name: Name = new Name();
  establishmentRegistrationNumber: number = undefined;
  newNin: number = undefined;
  establishmentName: BilingualText = new BilingualText();
}

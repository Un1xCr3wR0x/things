/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, BorderNumber, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';

export class ViolationContributorInfo {
  contributionAmount: number = undefined;
  contributorId: number = undefined;
  person: ViolationPerson = new ViolationPerson();
  violationAmount: number = undefined;
}

export class ViolationPerson {
  name: BilingualText = undefined;
  identity: NIN | Iqama | NationalId | Passport | BorderNumber;
  nationality: BilingualText = undefined;
  sin: number = undefined;
}

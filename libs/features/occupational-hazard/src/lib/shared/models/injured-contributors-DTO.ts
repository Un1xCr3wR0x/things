/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { Person } from './person';

/**
 * Model class to hold contributor details.
 *
 * @export
 * @class Contributor
 */

export class InjuredContributorsDTO {
  transactionStatus: BilingualText;
  person: Person = new Person();
  injuryId: number;
  accidentType: BilingualText;
  injuryReason: BilingualText;  
  socialInsuranceNo: number;
}

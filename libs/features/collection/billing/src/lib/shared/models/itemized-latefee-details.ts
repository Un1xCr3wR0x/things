/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ItemizedLateFee } from './itemized-late-fee';
import { PersonDetails } from './person-details';

export class ItemizedLateFeeDetails {
  person: PersonDetails = new PersonDetails();
  lateFee: ItemizedLateFee = new ItemizedLateFee();
}

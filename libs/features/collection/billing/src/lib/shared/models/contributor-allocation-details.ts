/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CreditAllocation } from './credit-allocation';
import { PersonDetails } from './person-details';
import { IndividualAllocationAmount } from './individual-allocation-amount';

export class ContributorAllocationDetails {
  creditAllocation: CreditAllocation[] = [];
  total: IndividualAllocationAmount = new IndividualAllocationAmount();
  person: PersonDetails = new PersonDetails();
}

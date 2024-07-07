import { PersonDetails } from './person-details';
import { IndividualAllocationAmount } from './individual-allocation-amount';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class IndividualAllocation {
  amount: IndividualAllocationAmount = new IndividualAllocationAmount();
  person: PersonDetails = new PersonDetails();
}

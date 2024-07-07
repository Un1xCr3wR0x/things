import { PersonDetails } from './person-details';
import { ItemizedAdjustmentDetails } from './itemized-adjustment-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ItemizedAdjustment {
  adjustments: ItemizedAdjustmentDetails = new ItemizedAdjustmentDetails();
  currentContributoryWage: number = undefined;
  oldContributoryWage: number = undefined;
  contributionUnit: number = undefined;
  newCalculationRate: number = undefined;
  oldCalculationRate: number = undefined;
  adjustmentContributoryWage: number;
  unit: string;
  person: PersonDetails = new PersonDetails();
}

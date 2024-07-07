/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';
import { ItemizedAdjustmentDetails } from './itemized-adjustment-details';
import { ItemizedLateFee } from './itemized-late-fee';

export class ItemizedCoverageDetails {
  name: BilingualText = new BilingualText();
  identity: NIN | Iqama | NationalId | Passport | BorderNumber;
  nationality: BilingualText = new BilingualText();
  currentContributoryWage: number = undefined;
  oldContributoryWage: number = undefined;
  lateFee: ItemizedLateFee = new ItemizedLateFee();
  adjustments: ItemizedAdjustmentDetails[] = [];
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';
import { ContributorContribution } from './contributor-contribution';
import { ItemizedAdjustmentDetails } from './itemized-adjustment-details';
import { ItemizedPaymentReceiptDetails } from './itemized-paymentReceipts-Details';
import { ItemizedLateFee } from './itemized-late-fee';

export class ItemizedBillDetails {
  adjustments: ItemizedAdjustmentDetails[] = [];
  credits: ItemizedAdjustmentDetails[] = [];
  contributorContribution: ContributorContribution = new ContributorContribution();
  name: BilingualText = new BilingualText();
  identity: NIN | Iqama | NationalId | Passport | BorderNumber;
  nationality: BilingualText = new BilingualText();
  currentContributoryWage: number = undefined;
  oldContributoryWage: number = undefined;
  calculationRate: number = undefined;
  contributionUnit: number = undefined;
  lateFee: ItemizedLateFee = new ItemizedLateFee();
  paymentReceiptsDetails: ItemizedPaymentReceiptDetails[] = [];
}

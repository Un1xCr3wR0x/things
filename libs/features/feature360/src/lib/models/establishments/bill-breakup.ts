/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentBreakup } from './adjustment-breakup';
import { ContributionBreakup } from './contribution-breakup';
import { LateFeeBreakUp } from './latefee-breakup';
import { AccountBreakup } from './account-breakup';

export class BillBreakup {
  adjustmentBreakUp: AdjustmentBreakup = new AdjustmentBreakup();
  contributionBreakUp: ContributionBreakup = new ContributionBreakup();
  lateFeeBreakUp: LateFeeBreakUp = new LateFeeBreakUp();
  accountBreakUp: AccountBreakup = new AccountBreakup();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EstablishmentShare } from './establishment-share';
import { ContributorShare } from './contributor-share';

export class ItemizedAdjustmentDetails {
  adjustmentDate: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
  contributionEndDate: GosiCalendar = new GosiCalendar();
  contributionStartDate: GosiCalendar = new GosiCalendar();
  contributorShare: ContributorShare = new ContributorShare();
  establishmentShare: EstablishmentShare = new EstablishmentShare();
  lateFee: number = undefined;
  total: number = undefined;
}

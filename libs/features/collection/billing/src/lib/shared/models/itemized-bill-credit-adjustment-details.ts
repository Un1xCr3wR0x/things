/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { ThirdPartyContributionShare } from './thirdParty-contribution-share';

export class ItemizedBillCreditAdjustmentDetails {
  establishmentName: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  thirdPartyContributionShare: ThirdPartyContributionShare = new ThirdPartyContributionShare();
  total: number = undefined;
}

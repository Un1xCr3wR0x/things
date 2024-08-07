import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ExcludedContributors {
  contributorId: number;
  contributorName: BilingualText;
  compensated: boolean;
  repetitionTierType?: BilingualText;
  totalBenefitAmount: number;
}

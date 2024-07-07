import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AdditionalGuarantee {
  type: BilingualText = new BilingualText();
  guaranteePercentage: number = undefined;
  guaranteeAmount: number = undefined;
  minGracePeriodInDays: number = undefined;
  maxGracePeriodInDays: number = undefined;
}

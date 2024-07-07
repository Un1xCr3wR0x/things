import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AllowancePeriod {
  allowanceDays: number = undefined;
  allowanceType: BilingualText = new BilingualText();
  distanceTravelled: number = undefined;
  visits: number = undefined;
}

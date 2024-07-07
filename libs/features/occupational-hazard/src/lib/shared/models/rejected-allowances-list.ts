import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectedAllowancesList {
  allowanceType: BilingualText = new BilingualText();
  treatmentType: BilingualText = new BilingualText();
  amount: number;
  visits: number;
  total: number;
  distance: number;
}

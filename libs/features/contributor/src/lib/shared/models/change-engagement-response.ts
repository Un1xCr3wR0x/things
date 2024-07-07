/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class ChangeEngagementResponse {
  message: BilingualText = new BilingualText();
  docFetchTypes: string[] = [];
  referenceNo: number = undefined;
  penaltyIndicator: number = undefined;
}

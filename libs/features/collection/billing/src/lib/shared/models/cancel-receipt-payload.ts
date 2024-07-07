/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class CancelReceiptPayload {
  reasonForCancellation: BilingualText = new BilingualText();
  comments: string = undefined;
  uuid: string = undefined;
  penaltyIndicator: BilingualText = new BilingualText();
  cancellationReasonOthers: string = undefined;
}

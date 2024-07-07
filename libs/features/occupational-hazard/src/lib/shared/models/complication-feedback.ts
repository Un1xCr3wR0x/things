/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

/**
 * Class for complication feedback details
 */
export class ComplicationFeedback {
  complicationId: number = undefined;
  status: BilingualText = new BilingualText();
  transactionMessage: BilingualText = new BilingualText();
}

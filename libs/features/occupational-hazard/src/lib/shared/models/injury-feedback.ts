/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

/**
 * Class for injury feedback details
 */

export class InjuryFeedback {
  injuryNo: number = undefined;
  transactionMessage: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
}

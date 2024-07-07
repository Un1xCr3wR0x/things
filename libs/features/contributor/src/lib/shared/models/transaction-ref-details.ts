/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class TransactionRefDetails {
  type: BilingualText = new BilingualText();
  referenceNo: number = undefined;
  draft: boolean = false;
}

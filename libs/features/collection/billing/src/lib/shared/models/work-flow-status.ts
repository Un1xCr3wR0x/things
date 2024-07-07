/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';

export class WorkFlowStatus {
  type: string = undefined;
  message: BilingualText = new BilingualText();
  referenceNo: number = undefined;
  count: number = undefined;
  recordActionType: string = undefined;
  status: string = undefined;
}

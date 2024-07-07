import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ModifyViolationResponse {
  message: BilingualText = new BilingualText();
  transactionTraceId: number;
  violationId: number;
}

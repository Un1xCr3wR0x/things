import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class CancelViolationRequest {
  channel: string;
  cancelViolationReason: BilingualText = new BilingualText();
  validatorName?: string;
  validatorRole: string;
  transactionTraceId: number;
  comments: string;
}

export class CancelViolationResponse {
  message: BilingualText = new BilingualText();
  transactionTraceId: number;
  violationId: number;
}

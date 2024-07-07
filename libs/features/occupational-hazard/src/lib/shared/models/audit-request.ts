/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class AuditRequest {
  comments: string = undefined;
  reason: BilingualText = new BilingualText();
}

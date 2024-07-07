/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CommonPatch } from './common-patch';

export class TerminateRequest extends CommonPatch {
  ibanAccountNo: string;
  paymentMethod: BilingualText;
  bankName: BilingualText;
  contributorAction?: string;
  contributorLeavingDate?: GosiCalendar;
  contributorLeavingReason?: number;
  transferTo?: number;
}

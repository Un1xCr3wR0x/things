/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class ImprisonmentVerifyResponse {
  benefitStopDate: GosiCalendar;
  message: BilingualText;
  referenceNo: number;
  verified: boolean;
}

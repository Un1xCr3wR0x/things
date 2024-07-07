/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ValidateHeirBenefit {
  deathDate: GosiCalendar;
  missingDate: GosiCalendar;
  reason: BilingualText;
  requestDate: GosiCalendar;
  constructor(reason: BilingualText, requestDate: GosiCalendar) {
    this.reason = reason;
    this.requestDate = requestDate;
  }
}

export interface ValidateHeirBenefitResponse {
  benefitRequestId: number;
  benefitType: string;
  message: BilingualText;
  referenceNo: number;
}

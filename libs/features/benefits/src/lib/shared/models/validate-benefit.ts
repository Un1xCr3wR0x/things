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
  isPpaOhDeath: boolean;
  constructor(reason: BilingualText, requestDate: GosiCalendar, isPpaOhDeath: boolean) {
    this.reason = reason;
    this.requestDate = requestDate;
    this.isPpaOhDeath = isPpaOhDeath;
  }
}

export interface ValidateHeirBenefitResponse {
  benefitRequestId: number;
  benefitType: string;
  message: BilingualText;
  referenceNo: number;
}

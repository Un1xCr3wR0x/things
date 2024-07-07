/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ReasonBenefit {
  deathDate: GosiCalendar;
  missingDate: GosiCalendar;
  heirBenefitRequestReason: BilingualText;

  constructor(deathDate: GosiCalendar, missingDate: GosiCalendar, reason: BilingualText) {
    this.deathDate = deathDate;
    this.missingDate = missingDate;
    this.heirBenefitRequestReason = reason;
  }
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';
import { GosiCalendar } from '@gosi-ui/core';

export class HeirBenefitList {
  amount: number;
  benefitStarted: boolean;
  heirStatus: BilingualText;
  modificationReason: BilingualText;
  motherId: number;
  name: BilingualText;
  nin: number;
  personId: number;
  relationship: BilingualText;
  startDate: GosiCalendar;
  status: BilingualText;
  statusDate: GosiCalendar;
  stopDate: GosiCalendar;
}

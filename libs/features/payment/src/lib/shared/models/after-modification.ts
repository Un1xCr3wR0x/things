/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
export class AfterModification {
  adjustmentPercentage?: number;
  adjustmentAmount?: number;
  adjustmentReason?: BilingualText;
  adjustmentType?: BilingualText;
  source?: BilingualText;
  adjustmentBalance?: number;
  createdDate?: GosiCalendar;
  benefitType?: BilingualText;
  benefitRequestDate?: GosiCalendar;
  status?: BilingualText;
  reason?: BilingualText;
  adjustmentStatus?: BilingualText;
}

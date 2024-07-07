/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class ModifyEngagementPeriod {
  engagementWageCoverageId: number;
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  reasonForCoverageModification: BilingualText = new BilingualText();
  coverages: BilingualText = new BilingualText();
  modified? = false;
}

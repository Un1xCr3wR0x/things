/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, GccEstablishment } from '@gosi-ui/core';

export interface PatchBasicDetails {
  activityType: BilingualText;
  gccEstablishment: GccEstablishment;
  name: BilingualText;
  navigationIndicator: number;
  comments: string;
  startDate: GosiCalendar;
  contentIds: string[];
  referenceNo: number;
  nationalityCode: BilingualText;
  uuid: string;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class HeirUnbornRequest {
  motherId: number;
  expectedDob: GosiCalendar;
  actionType: string;
  orphan: boolean;
  unborn: boolean;
  relationship: BilingualText;
  //remove
  dateOfBirth: GosiCalendar;
  dependentSource: string;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Contributor } from './contributor';
import { HeirsDetails } from './heirs';

export class ModifyPayeeDetails {
  amount: number;
  benefitStartDate: GosiCalendar;
  benefitStatus: BilingualText;
  benefitType: BilingualText;
  requestDate: GosiCalendar;
  heirs: HeirsDetails[];
  contributor: Contributor;
  //adjustments:AdjustmentDetails[];
}

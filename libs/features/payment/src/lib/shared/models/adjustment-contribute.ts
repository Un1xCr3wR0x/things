/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Identity } from './identity';
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
export class AdjustmentContribute {
  identity: Identity[];
  birthDate: GosiCalendar;
  name: BilingualText;
  age: Number;
}

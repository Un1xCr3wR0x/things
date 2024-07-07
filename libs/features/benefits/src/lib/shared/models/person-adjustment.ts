/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { IdentityAdjustment } from './identity-adjustment';
export class PersonAdjustment {
  identity: IdentityAdjustment[];
  birthDate: GosiCalendar;
  name: BilingualText = new BilingualText();
  age: number;
  nameBilingual: BilingualText;
}

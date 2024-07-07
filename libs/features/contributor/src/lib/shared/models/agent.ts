/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Agent {
  fullName: string;
  id: number;
  gender: string;
  isValid: boolean;
  nationality: BilingualText = new BilingualText();
  dateOfBirth: GosiCalendar = new GosiCalendar();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, IdentityTypeEnum } from '@gosi-ui/core';

export class Minor {
  relation: BilingualText = new BilingualText();
  isStillMinor: boolean;
  id: number;
  fullName: string;
  sex: string;
  nationality: BilingualText = new BilingualText();
  dateOfBirth: GosiCalendar = new GosiCalendar();
  minorType?: number;
  ageInHijiri?: number;
  idType?: IdentityTypeEnum;
}

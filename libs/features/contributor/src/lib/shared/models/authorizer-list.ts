/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, IdentityTypeEnum } from '@gosi-ui/core';

export class AuthorizerList {
  firstName: string;
  secondName?: string;
  thirdName?: string;
  familyName: string;
  englishName?: string;
  fullName: string;
  id: string;
  sex: BilingualText = new BilingualText();
  isValid: boolean;
  nationality: BilingualText = new BilingualText();
  dateOfBirth: GosiCalendar = new GosiCalendar();
  idType?: IdentityTypeEnum;
  age?: number;
  minorType?: string;
  ageInHijiri?: number;

  getFullName() {
    return [this.firstName, this.secondName, this.thirdName, this.familyName].filter(Boolean).join(' ');
  }
}

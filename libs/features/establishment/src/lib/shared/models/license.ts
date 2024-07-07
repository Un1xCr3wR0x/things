/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class License {
  issueDate: GosiCalendar = new GosiCalendar();
  expiryDate?: GosiCalendar;
  issuingAuthorityCode: BilingualText = new BilingualText();
  number: number;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from './gosi-calendar';
import { BilingualText } from './bilingual-text';

export class License {
  issueDate: GosiCalendar;
  expiryDate?: GosiCalendar;
  issuingAuthorityCode: BilingualText;
  number: number = undefined;
  constructor() {
    this.issueDate = new GosiCalendar();
    this.expiryDate = new GosiCalendar();
    this.issuingAuthorityCode = new BilingualText();
  }
}

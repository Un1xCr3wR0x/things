/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from './gosi-calendar';

export class CRNDetails {
  number: number = undefined;
  mciVerified = false;
  issueDate: GosiCalendar = new GosiCalendar();
  expiryDate?: GosiCalendar = new GosiCalendar();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from './gosi-calendar';
import { IdentityTypeEnum } from '../enums';

/**
 * Warpper class to National Identification Number elements.
 *
 * @export
 * @class NIN
 */
export class NIN {
  idType: string = undefined;
  expiryDate: GosiCalendar = new GosiCalendar();
  newNin: number = undefined;
  oldNin?: string = undefined;
  oldNinDateOfIssue?: GosiCalendar = new GosiCalendar();
  oldNinIssueVillage?: string = undefined;
  issueDate?: GosiCalendar = new GosiCalendar();

  constructor() {
    this.idType = IdentityTypeEnum.NIN;
  }
}

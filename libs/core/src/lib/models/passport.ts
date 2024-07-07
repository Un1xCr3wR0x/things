/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '../models';
import { IdentityTypeEnum } from '../enums';

/**
 * Wrapper class to hold passport details.
 *
 * @export
 * @class Passport
 */
export class Passport {
  idType: string = undefined;
  passportNo: string = undefined;
  expiryDate: GosiCalendar = undefined;
  issueDate: GosiCalendar = undefined;

  constructor() {
    this.idType = IdentityTypeEnum.PASSPORT;
  }
}

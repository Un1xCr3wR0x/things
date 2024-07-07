/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from './gosi-calendar';
import { IdentityTypeEnum } from '../enums';

/**
 * Wrapper class to hold Iqama details.
 *
 * @export
 * @class Iqama
 */
export class Iqama {
  idType: string = undefined;
  iqamaNo: number = undefined;
  borderNo?: string = undefined;
  expiryDate: GosiCalendar = new GosiCalendar();
  issueDate?: GosiCalendar = new GosiCalendar();

  constructor() {
    this.idType = IdentityTypeEnum.IQAMA;
  }
}

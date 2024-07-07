import { IdentityTypeEnum } from '../enums/identity-type';
import { GosiCalendar } from './gosi-calendar';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class NationalId {
  id: number = undefined;
  idType: string = undefined;
  expiryDate?: GosiCalendar = new GosiCalendar();
  issueDate?: GosiCalendar = new GosiCalendar();

  constructor() {
    this.idType = IdentityTypeEnum.NATIONALID;
  }
}

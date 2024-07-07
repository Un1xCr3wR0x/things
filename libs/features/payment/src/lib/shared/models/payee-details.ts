/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class PayeeDetails {
  payeeId: number;
  payeeName: BilingualText = new BilingualText();
  payeeCode: string = undefined;
  payeeType: BilingualText = new BilingualText();
  crn: string = undefined;
  iban: string = undefined;
  ibanStatus?: string = undefined;
  ibanId?: number = undefined;
  nationalId: number = undefined;
  iqama: number = undefined;
  nin: number = undefined;
}

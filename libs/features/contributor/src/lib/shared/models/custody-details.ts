/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Custodian } from './custodian';
import { Minor } from './minor';

export class CustodyDetails {
  custodyNumber: number = undefined;
  custodian: Custodian;
  minorList: Minor[] = [];
  custodyDate: GosiCalendar = new GosiCalendar();
  custodyStatus: BilingualText = new BilingualText();
  responseMessage: string;
  responseCode: boolean;
  authorizationSource: number;
  countryOfIssue?: BilingualText = new BilingualText();
  ibanBankAccountNo?: string;
  referenceNumber?: string;
}

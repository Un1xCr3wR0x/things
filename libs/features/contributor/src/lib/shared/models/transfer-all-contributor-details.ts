/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TransferAllContributorDetails {
  transferFrom: number = undefined;
  transferTo: number = undefined;
  transferToName: BilingualText = new BilingualText();
  transferFromName: BilingualText = new BilingualText();
  transferToType: BilingualText = new BilingualText();
  transferFromType: BilingualText = new BilingualText();
  transferDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  referenceNo: number = undefined;
  transferToEstName: BilingualText = new BilingualText();
  transferToEstType: BilingualText = new BilingualText();
  transferFromEstName : BilingualText = new BilingualText();
  transferFromEstType : BilingualText = new BilingualText();
  transferableContributorCount : number = undefined;
  totalContributorCount : number = undefined;
}

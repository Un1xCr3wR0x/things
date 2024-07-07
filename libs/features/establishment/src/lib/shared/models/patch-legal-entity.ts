/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CommonPatch } from './common-patch';
import { Owner } from './owner';

export class PatchLegalEntity extends CommonPatch {
  legalEntity: BilingualText = new BilingualText();
  paymentType: BilingualText = new BilingualText();
  transactionDate: GosiCalendar = new GosiCalendar();
  nationalityCode: BilingualText = new BilingualText();
  owners: Owner[] = [];
  lateFeeIndicator?: boolean = undefined;
}

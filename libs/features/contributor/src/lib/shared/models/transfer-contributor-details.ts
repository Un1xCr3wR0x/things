/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TransferContributorDetails {
  transferTo: number = undefined;
  transferToName: BilingualText = new BilingualText();
  formSubmissionDate: GosiCalendar = new GosiCalendar();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class CancelContributorDetails {
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  cancellationReason: BilingualText = new BilingualText();
}

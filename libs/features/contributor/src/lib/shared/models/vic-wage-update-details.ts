/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { VicWageUpdateSummary } from './vic-wage-update-summary';

export class VicWageUpdateDetails {
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  purposeOfRegistration: BilingualText = new BilingualText();
  wageSummary: VicWageUpdateSummary = new VicWageUpdateSummary();
}

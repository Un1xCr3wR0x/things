/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { VicEngagementPeriod } from './vic-engagement-period';

export class VicEngagementPayload {
  purposeOfRegistration: BilingualText = new BilingualText();
  engagementPeriod: VicEngagementPeriod = new VicEngagementPeriod();
  formSubmissionDate?: GosiCalendar = new GosiCalendar();
  joiningDate?: GosiCalendar = new GosiCalendar()
}

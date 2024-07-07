/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export class ImprisonmentPeriod {
  enteringDate: GosiCalendar = new GosiCalendar();
  releaseDate: GosiCalendar = new GosiCalendar();
  appliedReleaseDate: GosiCalendar = new GosiCalendar();
  releaseDateAsPerNic?: GosiCalendar = new GosiCalendar();
  benefitStopDate?: GosiCalendar = new GosiCalendar();
  prisoner: boolean;
  hasCertificate: boolean;
}

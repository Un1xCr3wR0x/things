/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { ViolationContributorInfo } from './violation-contributor-info';

export class ViolatedContributorsList {
  contributorInfo: ViolationContributorInfo = new ViolationContributorInfo();
  violationDate: GosiCalendar = new GosiCalendar();
  violationId: number = undefined;
  violationType: BilingualText = new BilingualText();
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class DependentCalcDetails {
  amount: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  noOfDependents: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
}

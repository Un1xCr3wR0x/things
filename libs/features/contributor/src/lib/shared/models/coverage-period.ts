/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { Coverage } from './coverage';

/**
 * This class is used hold coverage details
 */
export class CoveragePeriod {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  coverages: Coverage[] = [];
}

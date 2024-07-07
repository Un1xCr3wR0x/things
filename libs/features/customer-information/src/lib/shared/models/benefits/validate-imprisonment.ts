/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export class ValidateImprisonment {
  enteringDate: GosiCalendar = new GosiCalendar();
  releaseDate: GosiCalendar = new GosiCalendar();
  uuid?: string = undefined;
  referenceNo?: number;
}

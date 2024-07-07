/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class BulkWageDetails {
  requestId: number = undefined;
  fileName: string = undefined;
  fileSize: number = undefined;
  countOfFailed: number = undefined;
  countOfSuccessful: number = undefined;
  status: string = undefined;
  uploadDate: GosiCalendar = new GosiCalendar();
  transactionTraceId: number = undefined;
}

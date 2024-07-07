/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export class BulkWageWorkflowDetails {
  fileName: string = undefined;
  fileSize: number = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  noOfRecords: number = undefined;
}

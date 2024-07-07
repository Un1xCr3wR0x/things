/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from './gosi-calendar';
import { InspectionDecision } from './inspection-decision';
import { InspectionType } from './inspection-type';

export class InspectionDetails {
  correlationId: string = undefined;
  fieldActivityNumber: string = undefined;
  inspectionTypeInfo: InspectionType = new InspectionType();
  inspectionDecision: InspectionDecision[] = [];
  inspectionRefNo: string = undefined;
  reInspectionDate: GosiCalendar = new GosiCalendar();
  previousVisitDate: GosiCalendar = new GosiCalendar();
  inspectionRequestdate: GosiCalendar = new GosiCalendar();
  inspectionStatus: number = undefined;
  transactionTraceId: number = undefined;
}

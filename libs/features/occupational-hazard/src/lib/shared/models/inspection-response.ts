/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { InspectionType } from './inspection-type';
import { InspectionDecision } from './inspection-decision';
import { GosiCalendar } from '@gosi-ui/core';

export class InspectionResponses {
  inspectionTypeInfo: InspectionType;
  inspectionDecision: InspectionDecision[];
  inspectionRefNo: string;
  inspectionStatus: number;
  inspectionRequestdate = new GosiCalendar();
}

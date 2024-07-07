/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { InspectionDecision } from './inspection-decision';
import { InspectionTypeInfo } from './inspection-type-info';

export class InspectionDetails {
  inspectionTypeInfo: InspectionTypeInfo;
  inspectionDecision: InspectionDecision[];
  inspectionRefNo: string;
  inspectionId: number;
  reInspectionDate: GosiCalendar;
  previousVisitDate: GosiCalendar;
  inspectionRequestdate: GosiCalendar;
  origin: number;
}

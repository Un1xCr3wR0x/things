/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { BeforeModification } from './before-modification';
import { AfterModification } from './after-modification';
export class AdjustmentHistoryDetail {
  referenceNo: number;
  modificationDate: GosiCalendar;
  beforeModification?: BeforeModification;
  afterModification?: AfterModification;
  notes: string;
}

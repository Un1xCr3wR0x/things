/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
export class AdjustmentDetailsFilter {
  identifier: number;
  adjustmentId?: number;
  adjustmentType: BilingualText[] = [];
  adjustmentStatus: BilingualText[] = [];
  createdDate?: GosiCalendar;
  benefitRequestStartDate: Date = undefined;
  benefitRequestStopDate: Date = undefined;
  startDate: Date = undefined;
  stopDate: Date = undefined;
  benefitType?: BilingualText[] = [];
  requestedBy?: BilingualText[] = [];
  sortType?: string;
  adjustmentSortParam?: string;
}
export class SelectedBenefits {
  arabic: string;
  english: string;
  sequence: number;
}

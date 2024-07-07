import { BilingualText } from '@gosi-ui/core';
import { FilterDate } from './filter-date';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class FilterHistory {
  violationType: BilingualText[] = [];
  period: FilterDate = new FilterDate();
  status: BilingualText[] = [];
  channel: BilingualText[] = [];
  appliedPenaltyAmountStart: number;
  appliedPenaltyAmountEnd: number;
  appliedPaidAmountStart: number;
  appliedPaidAmountEnd: number;

  constructor() {
    this.appliedPaidAmountStart = null;
    this.appliedPaidAmountEnd = null;
    this.appliedPenaltyAmountEnd = null;
    this.appliedPenaltyAmountStart = null;
  }
}

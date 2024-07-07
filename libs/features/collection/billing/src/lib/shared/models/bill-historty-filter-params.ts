import { BilingualText } from '@gosi-ui/core';
import { FilterDate } from './filter-date';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BillHistoryFilterParams {
  rejectedOHInducator: string = undefined;
  adjustmentIndicator: string = undefined;
  violtaionIndicator: string = undefined;
  paymentStatus: BilingualText[] = [];
  billDate: FilterDate = new FilterDate();
  settlementDate: FilterDate = new FilterDate();
  amount: number = undefined;
  maxBillAmount: number = undefined;
  minBillAmount: number = undefined;
  maxCreditAmount: number = undefined;
  minCreditAmount: number = undefined;
  maxNoOfEstablishment: number = undefined;
  minNoOfEstablishment: number = undefined;
  maxNoOfActiveContributor: number = undefined;
  minNoOfActiveContributor: number = undefined;
  pageNo: number = undefined;
  pageSize: number = undefined;
  isSearch: boolean;
  isFilter: boolean;
}

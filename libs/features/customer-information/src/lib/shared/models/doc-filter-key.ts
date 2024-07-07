/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class DocFilters {
  documentType: string[];
  uploadPeriod: FilterDate = new FilterDate();
  addedBy: string[];
  system: string;
  transactionType: string[];
}

export class FilterDate {
  fromDate: string = undefined;
  toDate: string = undefined;
}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class DocumentFilters {
  documentType: BilingualText[] = [];
  documentTypeIds: number[] = [];
  uploadPeriod: FilterDate = new FilterDate();
  addedBy: BilingualText[] = [];
  addedByFilter: string[] = [];
}

export class FilterDate {
  fromDate: string = undefined;
  toDate: string = undefined;
}

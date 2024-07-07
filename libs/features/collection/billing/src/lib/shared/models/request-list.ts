/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RequestSort } from './sort-request';
import { Page } from './page';
import { FilterDate } from './filter-date';

export class RequestList {
  sort: RequestSort = new RequestSort();
  page: Page = new Page();
  maxContributoryWage: number = undefined;
  minContributoryWage: number = undefined;
  maxTotal: number = undefined;
  minTotal: number = undefined;
  maxContributionUnit: number = undefined;
  minContributionUnit: number = undefined;
  period: FilterDate = new FilterDate();
  search: number = undefined;
  saudiPerson: boolean;
}

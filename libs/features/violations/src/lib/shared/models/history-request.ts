import { FilterHistory } from './filter-history';
import { Page } from './page';
import { RequestSort } from './sort-request';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class HistoryRequest {
  filter: FilterHistory = new FilterHistory();
  page: Page = new Page();
  searchKey: string = undefined;
  sort: RequestSort = new RequestSort();
  isPreviousViolation?: boolean;
  contributorId?: number;
}

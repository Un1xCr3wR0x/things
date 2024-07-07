/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RequestSort } from './request-sort';
import { RequestLimit } from './request-limit';
import { RequestFilter } from './request-filter';
import { SearchParam } from './search-param';

export class SearchRequest {
  searchKey: string = undefined;
  searchParam: SearchParam = new SearchParam();
  sort: RequestSort = new RequestSort();
  limit: RequestLimit = new RequestLimit();
  filter: RequestFilter = new RequestFilter();
}

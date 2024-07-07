/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RequestSort } from './request-sort';
import { RequestLimit } from './request-limit';
import { RequestFilter } from './request-filter';

export class SearchRequest {
  searchKey: string = undefined;
  sort: RequestSort = new RequestSort();
  limit: RequestLimit = new RequestLimit();
  filter: RequestFilter = new RequestFilter();
}

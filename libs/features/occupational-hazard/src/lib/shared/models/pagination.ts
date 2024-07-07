/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { PaginationSize } from './pagination-size';
import { PaginationSort } from './pagination-sort';

export class Pagination {
  page: PaginationSize = new PaginationSize();
  sort: PaginationSort = new PaginationSort();
}

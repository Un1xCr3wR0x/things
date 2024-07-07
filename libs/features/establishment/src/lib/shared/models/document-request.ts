/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DocumentFilters } from './document-filters';
import { PaginationSize } from './pagination-size';

export class DocumentRequest {
  page: PaginationSize = new PaginationSize();
  sort: SortRequest = new SortRequest();
  searchKey: string = undefined;
  filter: DocumentFilters = new DocumentFilters();
}

export class SortRequest {
  direction: string = undefined;
  column: string = undefined;
}

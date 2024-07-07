/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TransactionFilter } from './transaction-filter';
import { TransactionLimit } from './transaction-limit';
import { TransactionSort } from './transaction-sort';
import { TransactionSearch } from './transaction-search';

export interface TransactionHistoryRequest {
  filter: TransactionFilter;
  page: TransactionLimit;
  sort: TransactionSort;
  search: TransactionSearch;
  personIdentifier?: number;
}

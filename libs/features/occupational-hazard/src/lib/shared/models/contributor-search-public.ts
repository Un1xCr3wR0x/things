/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributorSearchResult } from './contributor-search-result';

export class ContributorSearchPublic {
  ContributorSearchResult: ContributorSearchResult = new ContributorSearchResult();
  numberOfContributors: number;
  pageNo: number;
  pageSize: number;
}

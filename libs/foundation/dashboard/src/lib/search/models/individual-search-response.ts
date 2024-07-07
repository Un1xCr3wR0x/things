/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { IndividualSearchDetails } from './individual-search-details';

export class IndividualSearchResponse {
  contributors: IndividualSearchDetails[] = [];
  numberOfContributors: number;
  pageNo: number;
  pageSize: number;
}

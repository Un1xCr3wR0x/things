/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HeirBenefitFilter } from './heir-benefit-filter';
import { HeirLimit } from './heir-limit';
import { HeirSort } from './heir-sort';

export interface HeirHistoryRequest {
  filter: HeirBenefitFilter;
  page: HeirLimit;
  sort: HeirSort;
}

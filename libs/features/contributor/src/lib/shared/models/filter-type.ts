/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorFilter } from './contributor-filter';

/**
 * Wrapper class to hold activity type details
 *
 * @export
 * @class FilterType
 */
export class FilterType {
  search: string | number = undefined;
  filterReq: ContributorFilter = undefined;
  sortBy: string = undefined;
}

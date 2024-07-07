/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { OnHoldContent } from "./health-insurance-on-hold-content";

/**
 * The wrapper class for on-hold (insurance in progress) response.
 *
 * @export
 * @class InsuranceInProgressList
 */
export class InsuranceInProgressList {
  StatusCode: string;
  StatusDesc: string;
  content:OnHoldContent[]
  pageable: {
    sort: {
      sorted: string;
      unsorted: string;
      empty: string;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: string;
    unpaged: string;
  };
  last: string;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: string;
    unsorted: string;
    empty: string;
  };
  numberOfElements: number;
  first: string;
  size: number;
  number: number;
  empty: string;
}

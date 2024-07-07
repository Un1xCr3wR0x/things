/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { insuredListEmployeeInfo } from "./health-insurance-insured-employee-info";

/**
 * The wrapper class for insured list.
 *
 * @export
 * @class AddContEngagementDetails
 */
export class InsuredList {
  StatusCode: string;
  StatusDesc: string;
  content: insuredListEmployeeInfo[]
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

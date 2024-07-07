import { ViolationFilterResponse } from './violation-filter-response';
import { ViolationHistoryList } from './violation-history-list';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ViolationHistoryResponse {
  estViolationsCount: number;
  violationSummaryDtoList: ViolationHistoryList[];
  violationsFilterResponseDto: ViolationFilterResponse;
}

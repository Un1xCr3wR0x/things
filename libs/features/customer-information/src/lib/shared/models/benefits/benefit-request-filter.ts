/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models';

export class BenefitRequestFilter {
  requestPeriodFrom: Date = undefined;
  requestPeriodTo: Date = undefined;
  benefitTypes: BilingualText[] = [];
  searchKey: string;
  sortType: string;
  requestSortParam: string;
}

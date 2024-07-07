/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models';

export class DependentHistoryFilter {
  benefitPeriodFrom: Date = undefined;
  benefitPeriodTo: Date = undefined;
  dependentEvents: BilingualText[] = [];
  // paymentStatus: BilingualText[] = [];
  dependentNames: Array<number> = [];
}

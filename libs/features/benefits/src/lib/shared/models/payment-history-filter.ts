/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models';

export class PaymentHistoryFilter {
  benefitPeriodFrom: Date = undefined;
  benefitPeriodTo: Date = undefined;
  paymentStatus: BilingualText[] = [];
  paymentEvents: BilingualText[] = [];
}

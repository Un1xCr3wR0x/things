/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models';

export class DirectPaymentHistoryFilter {
  paymentPeriodFrom: string = undefined;
  paymentPeriodTo: string = undefined;
  paymentType: BilingualText[] = [];
  paymentStatus: BilingualText[] = [];
  BenefitType: BilingualText[] = [];
}

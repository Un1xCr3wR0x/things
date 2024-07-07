/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdjustmentDetails } from '@gosi-ui/features/benefits/lib/shared/models';

export class Payment {
  adjustmentDetails?: AdjustmentDetails[];
  paidAmount: number = undefined;
  paymentMethod: BilingualText = new BilingualText();
  paymentReferenceNo: string = undefined;
  paymentRefNo?: string = undefined;
  iban: string = undefined;
  bankName?: BilingualText = new BilingualText();
  paidDate: GosiCalendar = new GosiCalendar();
  paymentStatus: BilingualText = new BilingualText();
}

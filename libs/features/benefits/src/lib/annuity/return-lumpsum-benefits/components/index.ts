/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RestoreReasonDcComponent } from './restore-reason-dc/restore-reason-dc.component';
import { ReturnPaymentDetailsDcComponent } from './return-payment-details-dc/return-payment-details-dc.component';
import { SanadPaymentDcComponent } from './sanad-payment-dc/sanad-payment-dc.component';

export const RETURN_LUMPSUM_COMPONENTS = [
  RestoreReasonDcComponent,
  ReturnPaymentDetailsDcComponent,
  SanadPaymentDcComponent
];

export * from './restore-reason-dc/restore-reason-dc.component';
export * from './return-payment-details-dc/return-payment-details-dc.component';
export * from './sanad-payment-dc/sanad-payment-dc.component';

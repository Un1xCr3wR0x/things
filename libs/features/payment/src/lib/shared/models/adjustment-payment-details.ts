/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AdjustmentPaymentDetails {
  netAmount: number;
  directPaymentStatus: boolean;
}
export class HeirDirectPayment {
  directPaymentStatusUpdate: HeirPayment[];
}
export class HeirPayment {
  directPayment: boolean;
  personId: number;
}

import { CommonPatch } from './common-patch';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PatchMofPaymentDetails extends CommonPatch {
  comments: string;
  navigationIndicator: number;
  paymentType: boolean;
  referenceNo: number;
}

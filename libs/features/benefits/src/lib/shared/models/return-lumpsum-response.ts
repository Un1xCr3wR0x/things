/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class ReturnLumpsumResponse {
  benefitRequestId: number;
  benefitType: string;
  lumpsumRepaymentId: number;
  message: BilingualText;
  referenceNo: number;
}

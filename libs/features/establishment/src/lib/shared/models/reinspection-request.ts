/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ReinspectionRequest {
  type: string;
  registrationNumber: string;
  reason: string;
  inspRefNumber: string;
  currentOHRate: number;
  uuid?: string;
}

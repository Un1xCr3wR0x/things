import { LovList, BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ClaimsService {
  claimedAmount: number;
  comments?: string;
  discount: number;
  medicalDeduction: number;
  noOfUnits: number;
  paidAmount: number;
  rejectedAmount?: number;
  rejectionReason?: BilingualText = new BilingualText();
  disputedUnits: number;
  policyDeduction: number;
  serviceDescription: string;
  serviceId: number;
  treatmentDate: string;
  unitPrice: number;
  unitLovList: LovList;
  vat: number;
}

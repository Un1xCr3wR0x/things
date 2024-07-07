/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ExpenseList {
  vat: string = undefined;
  policyDeduction: string = undefined;
  paidAmount: string = undefined;
  medicalDeduction: string = undefined;
  discount: string = undefined;
  claimedAmount: string = undefined;
  description: string = undefined;
  treatmentDate: Date;
  serviceId: number = undefined;
}

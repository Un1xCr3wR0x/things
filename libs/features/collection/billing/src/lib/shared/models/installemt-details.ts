import { InstallmentPlanDetails } from './installment-plan-details';
import { WaiveDueAmount } from './waive-due-amount';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class InstallmentDetails {
  dueAmount: WaiveDueAmount = new WaiveDueAmount();
  eligibleForInstallment: number = undefined;
  installmentPlan: InstallmentPlanDetails[] = [];
  penaltyWaiverInWorkflow: boolean;
  outOfMarket: boolean;
}

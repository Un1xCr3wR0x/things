/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class InstallmentPeriodDetails {
  startDate: Date = new Date();
  endDate: Date = new Date();
  lastInstallmentAmount: number;
  periodOfInstallment: number;
  monthlyInstallmentAmount: number;
}

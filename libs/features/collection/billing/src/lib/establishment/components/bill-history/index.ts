/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BillHistoryScComponent } from './bill-history-sc/bill-history-sc.component';
import { LastPaidBillDetailsDcComponent } from './last-paid-bill-details-dc/last-paid-bill-details-dc.component';
import { BillHistoryTableDcComponent } from './bill-history-table-dc/bill-history-table-dc.component';
import { BillHistoryChartDcComponent } from './bill-history-chart-dc/bill-history-chart-dc.component';
import { BillHistoryMofScComponent } from './bill-history-mof-sc/bill-history-mof-sc.component';
import { BillHistoryMofTableDcComponent } from './bill-history-mof-table-dc/bill-history-mof-table-dc.component';
import { BillHistoryFilterDcComponent } from './bill-history-filter-dc/bill-history-filter-dc.component';
import { BillHistoryMofFilterDcComponent } from './bill-history-mof-filter-dc/bill-history-mof-filter-dc.component';
import { BillAdjustmentDetailsComponent } from './bill-adjustment-details/bill-adjustment-details.component';

export const BILL_HISTORY_SC_COMPONENTS = [
  BillHistoryScComponent,
  LastPaidBillDetailsDcComponent,
  BillHistoryTableDcComponent,
  BillHistoryMofTableDcComponent,
  BillHistoryChartDcComponent,
  BillHistoryMofScComponent,
  BillHistoryFilterDcComponent,
  BillHistoryMofScComponent,
  BillHistoryMofFilterDcComponent,
  BillAdjustmentDetailsComponent
];

export * from './bill-history-sc/bill-history-sc.component';
export * from './last-paid-bill-details-dc/last-paid-bill-details-dc.component';
export * from './bill-history-table-dc/bill-history-table-dc.component';
export * from './bill-history-chart-dc/bill-history-chart-dc.component';
export * from './bill-history-mof-sc/bill-history-mof-sc.component';
export * from './bill-history-mof-table-dc/bill-history-mof-table-dc.component';
export * from './bill-history-filter-dc/bill-history-filter-dc.component';
export * from './bill-history-mof-filter-dc/bill-history-mof-filter-dc.component';
export * from './bill-adjustment-details/bill-adjustment-details.component';

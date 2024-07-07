/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HoldResumeAllowanceScComponent } from './components/hold-resume-allowance-sc/hold-resume-allowance-sc.component';
import { InvoiceScComponent } from './components/invoice-sc/invoice-sc.component';
import { ReimbursementRequestScComponent } from './components/reimbursement-request-sc/reimbursement-request-sc.component';
import { ReportComplicationScComponent } from './components/report-complication-sc/report-complication-sc.component';
import { ReportOccupationalHazardScComponent } from './components/report-occupational-hazard-sc/report-occupational-hazard-sc.component';
import { ResumeDcComponent } from './resume-dc.component';
import { TransactionDcComponent } from './transaction-dc.component';
import { AllowancePayeeScComponent } from './components/allowance-payee-sc/allowance-payee-sc.component';
import { AllowanceDetailsScComponent } from './components/allowance-details-sc/allowance-details-sc.component';
import { AllowanceAuditScComponent } from './components/allowance-audit-sc/allowance-audit-sc.component';
import { ClaimsAuditScComponent } from './components/claims-audit-sc/claims-audit-sc.component';
import { TransactionResolver } from '@gosi-ui/core';
import { ReportComplicationDiseaseScComponent } from './components/report-complication-disease-sc/report-complication-disease-sc.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: 'injury',
        component: ReportOccupationalHazardScComponent
      },
      {
        path: 'complication',
        component: ReportComplicationScComponent
      },
      {
        path: 'disease-complication',
        component: ReportComplicationDiseaseScComponent
      },
      {
        path: 'disease',
        component: ReportOccupationalHazardScComponent
      },
      {
        path: 'reimbursement',
        component: ReimbursementRequestScComponent
      },
      {
        path: 'invoice',
        component: InvoiceScComponent
      },
      {
        path: 'hold-resume',
        component: HoldResumeAllowanceScComponent
      },
      {
        path: 'allowance-payee',
        component: AllowancePayeeScComponent
      },
      {
        path: 'allowance',
        component: AllowanceAuditScComponent
      },
      {
        path: 'claims',
        component: ClaimsAuditScComponent
      },
      {
        path: 'view',
        component: AllowanceDetailsScComponent
      }
    ]
  },
  {
    path: 'resume/:transactionId/:transactionRefId',
    component: ResumeDcComponent,
    resolve: { transaction: TransactionResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}

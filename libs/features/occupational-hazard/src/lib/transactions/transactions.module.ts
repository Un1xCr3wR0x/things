/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { InjuryModule } from '../injury/injury.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionDcComponent } from './transaction-dc.component';
import { ReportOccupationalHazardScComponent } from './components/report-occupational-hazard-sc/report-occupational-hazard-sc.component';
import { InjuryRoutingModule } from '../injury/injury-routing.module';
import { SharedModule } from '@gosi-ui/features/occupational-hazard/lib/shared/shared.module';
import { ComplicationModule } from '../..';
import { ResumeDcComponent } from './resume-dc.component';
import { ReportComplicationScComponent } from './components/report-complication-sc/report-complication-sc.component';
import { ReimbursementRequestScComponent } from './components/reimbursement-request-sc/reimbursement-request-sc.component';
import { InvoiceScComponent } from './components/invoice-sc/invoice-sc.component';
import { HoldResumeAllowanceScComponent } from './components/hold-resume-allowance-sc/hold-resume-allowance-sc.component';
import { AllowancePayeeScComponent } from './components/allowance-payee-sc/allowance-payee-sc.component';
import { AllowanceDetailsScComponent } from './components/allowance-details-sc/allowance-details-sc.component';
import { AllowanceAuditScComponent } from './components/allowance-audit-sc/allowance-audit-sc.component';
import { ClaimsAuditScComponent } from './components/claims-audit-sc/claims-audit-sc.component';
import { ReportComplicationDiseaseScComponent } from './components/report-complication-disease-sc/report-complication-disease-sc.component';

@NgModule({
  declarations: [
    TransactionDcComponent,
    ReportOccupationalHazardScComponent,
    ResumeDcComponent,
    ReportComplicationScComponent,
    ReimbursementRequestScComponent,
    InvoiceScComponent,
    HoldResumeAllowanceScComponent,
    AllowancePayeeScComponent,
    AllowanceDetailsScComponent,
    AllowanceAuditScComponent,
    ClaimsAuditScComponent,
    ReportComplicationDiseaseScComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ThemeModule,
    InjuryRoutingModule,
    ComplicationModule,
    InjuryModule,
    SharedModule,
    IconsModule
  ]
})
export class TransactionsModule {}

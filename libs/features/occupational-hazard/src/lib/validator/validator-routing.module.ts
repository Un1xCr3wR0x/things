/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AllowancePayeeScComponent,
  CloseComplicationScComponent,
  ModifyCloseComplicationScComponent,
  ModifyCloseInjuryScComponent,
  ModifyComplicationScComponent,
  ModifyInjuryScComponent,
  RejectInjuryScComponent,
  HoldAndResumeAllowanceScComponent,
  ClaimsValidatorScComponent,
  AuditorClaimDetailsScComponent,
  AllowanceAuditScComponent,
  ReimbursementDetailsScComponent,
  AllowanceAuditOhScComponent,
  MedicalReportScComponent,  
  DeadBodyRepatriationScComponent
} from './components';
import { AddComplicationScComponent } from './components/add-complication-sc/add-complication-sc.component';
import { AddInjuryScComponent } from './components/add-injury-sc/add-injury-sc.component';
import { AllowanceDetailsScComponent } from './components/allowance-details-sc/allowance-details-sc.component';
import { CloseInjuryScComponent } from './components/close-injury-sc/close-injury-sc.component';
import { RejectComplicationScComponent } from './components/reject-complication-sc/reject-complication-sc.component';
import { ReopenComplicationScComponent } from './components/reopen-complication-sc/reopen-complication-sc.component';
import { ReopenInjuryScComponent } from './components/reopen-injury-sc/reopen-injury-sc.component';
import { ValidatorDcComponent } from './validator-dc.component';
import { AddDiseaseScComponent } from './components/disease/add-disease-sc/add-disease-sc.component';
import { ModifyCloseDiseaseScComponent } from './components/disease/modify-close-disease-sc/modify-close-disease-sc.component';
import { EarlyReassessmentScComponent } from './components/early-reassessment-sc/early-reassessment-sc.component';
import { MbConveyanceAllowanceScComponent } from './components/mb-conveyance-allowance-sc/mb-conveyance-allowance-sc.component';
import { RequestNewReportsScComponent } from './components/request-new-reports-sc/request-new-reports-sc.component';
import { ReportComplicationDiseaseScComponent } from '../transactions/components/report-complication-disease-sc/report-complication-disease-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'allowance',
        component: AllowanceDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.ALLOWANCE-TRANSACTION'
        }
      },
      {
        path: 'injury',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'complication',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'reject-injury',
        component: RejectInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION'
        }
      },
      {
        path: 'reject-complication',
        component: RejectComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: 'validate-reimbursement',
        component: ReimbursementDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.ALLOWANCE-TRANSACTION'
        }
      },
      {
        path: 'modify-injury',
        component: ModifyInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION'
        }
      },
      {
        path: 'modify-complication',
        component: ModifyComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: 'reopen-injury',
        component: ReopenInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION'
        }
      },
      {
        path: 'reopen-complication',
        component: ReopenComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: 'close-injury',
        component: CloseInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLOSE-INJURY-TRANSACTION'
        }
      },
      {
        path: 'close-injury/mbassessment',
        component: CloseInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.BENEFIT-TRANSACTION'
        }
      },
      {
        path: 'medical-report',
        component: MedicalReportScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REQUEST-MEDICAL-REPORT'
        }
      },
      {
        path: 'modify-close-injury',
        component: ModifyCloseInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-CLOSING-DETAILS'
        }
      },
      {
        path: 'modify-close-disease',
        component: ModifyCloseDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-DISEASE-CLOSING-DETAILS'
        }
      },
      {
        path: 'close-complication',
        component: CloseComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLOSE-COMP-TRANSACTION'
        }
      },
      {
        path: 'modify-close-complication',
        component: ModifyCloseComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-COMPLICATION-CLOSING-DETAILS'
        }
      },
      {
        path: 'allowance-payee',
        component: AllowancePayeeScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.MODIFY-ALLOWANCE-PAYEE'
        }
      },
      {
        path: 'oh-claims',
        component: ClaimsValidatorScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS-VALIDATOR.CLAIM-REQUEST'
        }
      },
      {
        path: 'auditor',
        component: AuditorClaimDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.AUDITOR.CLAIM-AUDIT-REQUEST'
        }
      },
      {
        path: 'auditor/claim/:tpaCode/:invoiceId/:claimNo/:referenceNo',
        component: AuditorClaimDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.AUDITOR.AUDIT-HEADER'
        }
      },
      {
        path: 'reimbursement',
        component: ReimbursementDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.ALLOWANCE-TRANSACTION'
        }
      },
      {
        path: 'hold-allowance',
        component: HoldAndResumeAllowanceScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOLD-ALLOWANCE'
        }
      },
      {
        path: 'resume-allowance',
        component: HoldAndResumeAllowanceScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE.RESUME-ALLOWANCE'
        }
      },
      {
        path: 'allowance-audit',
        component: AllowanceAuditScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.AUDITOR.ALLOWANCE-HEADER'
        }
      },
      {
        path: 'disease',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'disease',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'audit-allowance',
        component: AllowanceAuditOhScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.AUDITOR.MEDICAL-COST-CONTROLLER-ALLOWANCE-HEADER'
        }
      },
      {
        path: 'earlyreassessment',
        component: EarlyReassessmentScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'mb-conveyance-allowance',
        component: MbConveyanceAllowanceScComponent,
        data: {
          breadcrumb: 'mb-conveyance-allowance'
        }
      },
      {
        path: 'mb-request-new-reports',
        component: RequestNewReportsScComponent,
        data: {
          breadcrumb: 'mb-request-new-reports'
        }
      },
      {
        path: 'repatriation',
        component: DeadBodyRepatriationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'disease-complication',
        component: ReportComplicationDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      }
    ]
  }
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}


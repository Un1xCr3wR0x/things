/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccupationalHazardDcComponent } from './occupational-hazard-dc.component';
import {
  ContributorSearchScComponent,
  ModifyAllowancePayeeScComponent,
  ReimbursementClaimsScComponent
} from './shared/component';
import { TabsetScComponent } from './shared/component/tabset-sc/tabset-sc.component';
import { UploadDocumentsScComponent } from './claims';

export const routes: Routes = [
  {
    path: '',
    component: OccupationalHazardDcComponent,
    children: [
      { path: 'report', component: ContributorSearchScComponent },
      {
        path: 'injury',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/injury/injury.module').then(mod => mod.InjuryModule)
      },
      {
        path: 'complication',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/complication/complication.module').then(
            mod => mod.ComplicationModule
          )
      },
      {
        path: 'disease',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/disease/disease.module').then(mod => mod.DiseaseModule)
      },
      {
        path: 'group-injury',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/group-injury/group-injury.module').then(mod => mod.GroupInjuryModule)
      },
      {
        path: 'validator',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/validator/validator.module').then(
            mod => mod.ValidatorModule
          )
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:complicationId/modify-payee',
        component: ModifyAllowancePayeeScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.MODIFY-PAYEE'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/modify-payee',
        component: ModifyAllowancePayeeScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.MODIFY-PAYEE'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:complicationId/reimbursement',
        component: ReimbursementClaimsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:transactionId/:registrationNo/:socialInsuranceNo/:complicationId/reimbursement/:reimbId/:injuryNo',
        component: ReimbursementClaimsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:transactionId/:registrationNo/:socialInsuranceNo/:injuryId/reimbursement/:reimbId',
        component: ReimbursementClaimsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/reimbursement',
        component: ReimbursementClaimsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:reimbId/claims/upload-documents',
        component: UploadDocumentsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:complicationId/:reimbId/claims/upload-documents',
        component: UploadDocumentsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS.REIMBURSEMENT-REQUEST'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId',
        component: TabsetScComponent,
        children: [
          {
            path: 'injury',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/injury/injury.module').then(mod => mod.InjuryModule)
          },
          {
            path: 'allowance',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/allowance/allowance.module').then(
                mod => mod.AllowanceModule
              )
          },
          {
            path: 'claims',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/claims/claims.module').then(mod => mod.ClaimsModule)
          },
          {
            path: 'disease',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/disease/disease.module').then(mod => mod.DiseaseModule)
          }
        ]
      },
      {
        path: 'view/:socialInsuranceNo/:injuryId',
        component: TabsetScComponent,
        children: [
          {
            path: 'injury',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/injury/injury.module').then(mod => mod.InjuryModule)
          }
        ]
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:complicationId',
        component: TabsetScComponent,
        children: [
          {
            path: 'complication',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/complication/complication.module').then(
                mod => mod.ComplicationModule
              )
          },
          {
            path: 'allowance',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/allowance/allowance.module').then(
                mod => mod.AllowanceModule
              )
          },
          {
            path: 'claims',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard/lib/claims/claims.module').then(mod => mod.ClaimsModule)
          }
        ]
      },

      {
        path: 'validator',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/validator/validator.module').then(
            mod => mod.ValidatorModule
          )
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/transactions/transactions.module').then(
            mod => mod.TransactionsModule
          ),
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MY-TRANSACTIONS'
        }
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/reports/reports.module').then(mod => mod.ReportsModule)
      },
      {
        path: '',
        component: ContributorSearchScComponent,
        pathMatch: 'full',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OH'
        }
      },
      {
        path: 'reassessment',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard/lib/reassessment/reassessment.module').then(
            mod => mod.ReassessmentModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccupationalHazardRoutingModule {}


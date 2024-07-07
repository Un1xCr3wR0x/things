/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { EstablishmentDcComponent } from './establishment-dc.component';

export const routes: Routes = [
  {
    path: 'transactions/resume/:transactionId/:transactionRefId',
    component: EstablishmentDcComponent
  },
  {
    path: '',
    component: EstablishmentDcComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(mod => mod.ProfileModule)
      },
      {
        path: 'register/proactive',
        loadChildren: () =>
          import('./register-proactive/register-proactive.module').then(mod => mod.RegisterProactiveModule),
        data: {
          breadcrumb: 'ESTABLISHMENT.COMPLETE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./register-establishment/register-establishment.module').then(mod => mod.RegisterEstablishmentModule),
        data: {
          breadcrumb: 'ESTABLISHMENT.ADD-ESTABLISHMENT'
        }
      },
      {
        path: 'change/branch-to-main',
        loadChildren: () =>
          import('./change-main-establishment/change-main-establishment.module').then(
            mod => mod.ChangeMainEstablishmentModule
          )
      },
      {
        path: 'change/delink',
        loadChildren: () =>
          import('./delink-establishment/delink-establishment.module').then(mod => mod.DelinkEstablishmentModule)
      },
      {
        path: 'change',
        loadChildren: () =>
          import('./change-establishment/change-establishment.module').then(mod => mod.ChangeEstablishmentModule)
      },
      {
        path: 'change/validate',
        loadChildren: () =>
          import('./change-establishment/change-establishment.module').then(mod => mod.ChangeEstablishmentModule)
      },
      {
        path: 'change/admin-reenter',
        loadChildren: () =>
          import('./change-establishment/change-establishment.module').then(mod => mod.ChangeEstablishmentModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./manage-admin/manage-admin.module').then(mod => mod.ManageAdminModule)
      },
      {
        path: 'terminate',
        loadChildren: () =>
          import('./terminate-establishment/terminate-establishment.module').then(
            mod => mod.TerminateEstablishmentModule
          )
      },
      {
        path: 'reopen',
        loadChildren: () =>
          import('./reopen-establishment/reopen-establishment.module').then(mod => mod.ReopenEstablishmentModule)
      },
      {
        path: 'flags',
        loadChildren: () =>
          import('./flag-establishment/flag-establishment.module').then(mod => mod.FlagEstablishmentModule)
      },
      {
        path: 'oh-safety',
        loadChildren: () =>
          import('./oh-safety-inspection/oh-safety-inspection.module').then(mod => mod.OhSafetyInspectionModule)
      },
      {
        path: 'certificates',
        loadChildren: () =>
          import('./request-certificate/request-certificate.module').then(mod => mod.RequestCertificateModule)
      },
      {
        path: 'relationship-manager',
        loadChildren: () =>
          import('./relationship-manager/relationship-manager.module').then(mod => mod.RelationshipManagerModule)
      },
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'refresh',
        component: RefreshDcComponent
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule),
        data: {
          breadcrumb: 'ESTABLISHMENT.MY-TRANSACTIONS'
        }
      },
      {
        path: 'medical-insurance',
        loadChildren: () => import('./medical-insurance/medical-insurance.module').then(mod => mod.MedicalInsuranceModule),
      },
      {
        path: 'health-insurance-list',
        loadChildren: () => import('./health-insurance-list/health-insurance-list.module').then(mod => mod.HealthInsuranceListModule),
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentRoutingModule {}

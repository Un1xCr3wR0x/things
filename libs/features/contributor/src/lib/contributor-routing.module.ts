/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContributorDcComponent } from './contributor-dc.component';
import { PersonSearchScComponent } from './shared';

export const routes: Routes = [
  {
    path: '',
    component: ContributorDcComponent,
    children: [
      {
        path: 'add',
        loadChildren: () => import('./add-contributor/add-contributor.module').then(mod => mod.AddContributorModule)
      },
      {
        path: 'engagement',
        loadChildren: () =>
          import('./change-engagement/change-engagement.module').then(mod => mod.ChangeEngagementModule)
      },
      {
        path: 'terminate',
        loadChildren: () =>
          import('./terminate-contributor/terminate-contributor.module').then(mod => mod.TerminateContributorModule)
      },
      {
        path: 'cancel',
        loadChildren: () =>
          import('./cancel-contributor/cancel-contributor.module').then(mod => mod.CancelContributorModule)
      },
      {
        path: 'wage',
        loadChildren: () => import('./manage-wage/manage-wage.module').then(mod => mod.ManageWageModule)
      },
      {
        path: 'contributor-list',
        loadChildren: () => import('./contributor-list/contributor-list.module').then(mod => mod.ContributorListModule)
      },
      {
        path: 'seconded',
        loadChildren: () => import('./add-seconded/add-seconded.module').then(mod => mod.AddSecondedModule)
      },
      {
        path: 'transfer',
        loadChildren: () =>
          import('./transfer-contributor/transfer-contributor.module').then(mod => mod.TransferContrbutorModule)
      },
      {
        path: 'add-vic',
        loadChildren: () => import('./add-vic/add-vic.module').then(mod => mod.AddVicModule)
      },
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'contract',
        loadChildren: () =>
          import('./authenticate-contract/authenticate-contract.module').then(mod => mod.AuthenticateContractModule)
      },
      {
        path: 'compliance',
        loadChildren: () =>
          import('./manage-compliance/manage-compliance.module').then(mod => mod.ManageComplianceModule)
      },
      {
        path: 'terminate-vic',
        loadChildren: () => import('./terminate-vic/terminate-vic.module').then(mod => mod.TerminateVicModule)
      },
      {
        path: 'cancel-vic',
        loadChildren: () => import('./cancel-vic/cancel-vic.module').then(mod => mod.CancelVicModule)
      },
      {
        path: 'individual',
        loadChildren: () => import('./manage-wage/manage-wage.module').then(mod => mod.ManageWageModule)
      },
      {
        path: 'add-authorization',
        loadChildren: () =>
          import('./add-authorization/add-authorization.module').then(mod => mod.AddAuthorizationModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
      },
      {
        path: 'add-Engagement',
        loadChildren: () => import('./e-registration/e-registration.module').then(mod => mod.ERegistrationModule)
      },
      {
        path: 'reActivate',
        loadChildren: () => import('./reactivate/reactivate.module').then(mod => mod.ReactivateModule)
      },
      {
        path: 'reactivate-vic',
        loadChildren: () => import('./reactivate-vic/reactivate-vic.module').then(mod => mod.ReactivateVicModule)
      },
      {
        path: 'enter-rpa',
        loadChildren: () => import('./enter-rpa/enter-rpa.module').then(mod => mod.EnterRpaModule)
      },
      {
        //TODO: issue with navigating to page with variable registrationNo.
        path: 'health-insurance',
        loadChildren: () => import('./health-insurance/health-insurance.module').then(mod => mod.HealthInsuranceModule)
      }
    ]
  },
  {
    path: 'search',
    component: PersonSearchScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.ADD-CONTRIBUTOR'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributorRoutingModule {}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViolationsDcComponent } from './violations-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: ViolationsDcComponent,
    children: [
      {
        path: 'validator',
        loadChildren: () => import('./validator/violation-validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'violation-history',
        loadChildren: () =>
          import('./violation-history/violation-history.module').then(mod => mod.ViolationHistoryModule)
      },
      {
        path: ':estRegId/violation-profile/:transactionId',
        loadChildren: () =>
          import('./violation-profile/violation-profile.module').then(mod => mod.ViolationProfileModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
      },
      {
        path: 'raise-violations',
        loadChildren: () => import('./raise-violations/raise-violations.module').then(mod => mod.RaiseViolationsModule)
      },
      {
        path: 'commitment-indicator',
        loadChildren: () => import('./commitment-indicator/commitment-indicator.module').then(mod=>mod.CommitmentIndicatorModule),
        data: {
          breadcrumb: 'VIOLATIONS.COMPLIANCE-INDICATOR'
        }
      },
      {
        path: ':estRegId/violation-appeal/:transactionId',
        loadChildren: () =>
          import('./violation-appeal/violation-appeal.module').then(mod => mod.ViolationAppealModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViolationsRoutingModule {}

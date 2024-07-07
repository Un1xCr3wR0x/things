/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BenefitsDcComponent } from './benefits-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: BenefitsDcComponent,
    children: [
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'annuity',
        loadChildren: () => import('./annuity/annuity.module').then(mod => mod.AnnuityModule)
      },
      {
        path: 'individual',
        loadChildren: () =>
          import('./individual-benefits/individual-benefits.module').then(mod => mod.IndividualBenefittModule)
      },
      {
        path: 'individual/:id',
        loadChildren: () =>
          import('./individual-benefits/individual-benefits.module').then(mod => mod.IndividualBenefittModule)
      },
      {
        path: 'saned',
        loadChildren: () => import('./saned/saned.module').then(mod => mod.SanedModule)
      },
      {
        path: 'my-benefit-requests',
        loadChildren: () => import('./benefit-requests/benefit-requests.module').then(mod => mod.BenefitRequestsModule)
      },
      {
        path: 'bypass',
        loadChildren: () =>
          import('./bypass-reassessment/bypass-reassessment.module').then(mod => mod.BypassReassessmentModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitsRoutingModule {}

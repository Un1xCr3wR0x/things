/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentDcComponent } from './payment-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: PaymentDcComponent,
    children: [
      { path: '', redirectTo: 'payment', pathMatch: 'full' },
      {
        path: 'payonline',
        loadChildren: () => import('./payment/payment.module').then(mod => mod.PaymentModule)
      },
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'adjustment',
        loadChildren: () => import('./adjustment/adjustment.module').then(mod => mod.AdjustmentModule)
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
export class PaymentRoutingModule {}

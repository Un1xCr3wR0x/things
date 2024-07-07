/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDcComponent } from './transaction-dc.component';
import { CommonModule } from '@angular/common';
import { ThirdPartyTransactionScComponent } from './components';
import { DirectPaymentScComponent } from './components/direct-payment-sc/direct-payment-sc.component';
import { MaintainAdjustmentComponent } from './components/maintain-adjustment-sc/maintain-adjustment-sc.component';
const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: 'add-third-party',
        component: ThirdPartyTransactionScComponent
      },
      {
        path: 'manage-third-party',
        component: ThirdPartyTransactionScComponent
      },
      {
        path: 'direct-payment',
        component: DirectPaymentScComponent
      },
      {
        path: 'maintain-adjustment',
        component: MaintainAdjustmentComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionScComponent } from './components';
import { TransactionDcComponent } from './transaction-dc.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: 'reopen/:isReopen',
        component: TransactionScComponent
      },
      {
        path: 'complaint',
        component: TransactionScComponent
      },
      {
        path: 'enquiry',
        component: TransactionScComponent
      },
      {
        path: 'appeal',
        component: TransactionScComponent
      },
      {
        path: 'plea',
        component: TransactionScComponent
      },
      {
        path: 'suggestion',
        component: TransactionScComponent
      },
      {
        path: 'general-appeal',
        component: TransactionScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}

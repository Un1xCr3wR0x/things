/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppealsDcComponent } from './appeals-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: AppealsDcComponent,
    children: [
     {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => 
         
        mod.ValidatorModule)
      },
      {
        path: 'appeal', 
        component: AppealsDcComponent,
        data: {
          breadcrumb: ''
        }
      } /*,
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
      },*/
    ]
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppealsRoutingModule {}
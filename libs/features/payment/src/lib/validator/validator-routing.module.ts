/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ValidatorPaymentScComponent } from './components';
export const routes: Routes = [
  {
    path: 'pay-online',
    component: ValidatorPaymentScComponent,
    data: {
      breadcrumb: ''
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}

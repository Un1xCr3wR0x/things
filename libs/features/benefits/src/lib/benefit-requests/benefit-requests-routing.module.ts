/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBenefitRequestsScComponent } from './my-benefit-requests-sc/my-benefit-requests-sc.component';

const routes: Routes = [
  {
    path: '',
    component: MyBenefitRequestsScComponent,
    data: {
      breadcrumb: ''
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitRequestsRoutingModule {}

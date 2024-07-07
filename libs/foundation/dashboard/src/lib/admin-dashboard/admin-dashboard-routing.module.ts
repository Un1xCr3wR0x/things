/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllEstablishmentScComponent, IndividualEstablishmentScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: AllEstablishmentScComponent,
    data: {
      breadcrumb: 'HOME'
    }
  },
  {
    path: 'branch/:branchid',
    component: IndividualEstablishmentScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDcComponent } from './components/dashboard-dc/dashboard-dc.component';

/**
 * Declaration of routes for Dashboard feature
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardDcComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@gosi-ui/foundation-dashboard').then(mod => mod.DashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

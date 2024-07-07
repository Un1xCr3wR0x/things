/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Declaration of routes for Dashboard feature
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then(mod => mod.AdminDashboardModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(mod => mod.SearchModule)
  },
  {
    path: 'individual',
    loadChildren: () =>
      import('./individual-app/individual-dashboard.module').then(mod => mod.IndividualDashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

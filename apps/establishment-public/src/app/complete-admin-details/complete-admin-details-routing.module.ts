/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompleteAdminDetailsDcComponent } from './complete-admin-details-dc.component';

/**
 * Declaration of routes for Dashboard feature
 */
const routes: Routes = [
  {
    path: '',
    component: CompleteAdminDetailsDcComponent,
    children: [
      {
        path: 'establishment',
        loadChildren: () => import('@gosi-ui/features/establishment').then(mod => mod.EstablishmentModule),
        data: {
          breadcrumb: 'MENUITEM.ESTABLISHMENT-SERVICES'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteAdminDetailsRoutingModule {}

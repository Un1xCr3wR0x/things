/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeDcComponent } from './components';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeDcComponent,

    children: [
      { path: '', redirectTo: 'authenticate/contract/login' },
      // contributor stand alone page to approve/reject contract
      {
        path: 'authenticate',
        loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule),
        data: {
          breadcrumb: 'MENUITEM.CONTRIBUTOR-SERVICE'
        }
      },
      //UI Feature
      {
        path: 'benefits',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: ''
        }
      },
      //Payment Feature
      {
        path: 'payment',
        loadChildren: () => import('@gosi-ui/features/payment').then(mod => mod.PaymentModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'oh',
        loadChildren: () => import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        data: {
          breadcrumb: ''
        }
      }
    ]
  }
];

/**
 * Routing module for Home feature
 *
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class HomeRoutingModule {}

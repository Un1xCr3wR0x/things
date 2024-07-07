/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components';
import { NotFoundDcComponent } from '@gosi-ui/foundation-theme';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', redirectTo: 'establishment/register' },
      { path: '', redirectTo: 'authenticate' },
      // bypass assessment stand alone page to approve/reject bypass
      {
        path: 'authenticate',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'benefits',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: ''
        }
      },
      //Manage Person Feature
      {
        path: 'profile',
        loadChildren: () => import('@gosi-ui/features/customer-information').then(mod => mod.CustomerInformationModule)
      },
      //Transaction Tracing
      {
        path: 'transactions',
        loadChildren: () => import('@gosi-ui/foundation/transaction-tracing').then(mod => mod.TransactionTracingModule)
      },

      {
        path: 'error',
        component: NotFoundDcComponent
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

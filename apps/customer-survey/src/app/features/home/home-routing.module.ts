/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundDcComponent } from '@gosi-ui/foundation-theme';
import { HomeComponent } from './components';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'error',
        component: NotFoundDcComponent
      },
      { path: '', redirectTo: 'customer-survey' },
      {
        path: 'customer-survey/:id',
        loadChildren: () => import('@gosi-ui/features/customer-survey').then(mod => mod.CustomerSurveyModule),
        data: {}
      },
      {
        path: 'oh',
        loadChildren: () => import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'establishment',
        loadChildren: () => import('@gosi-ui/features/establishment').then(mod => mod.EstablishmentModule),
        data: {
          breadcrumb: 'MENUITEM.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'payment',
        loadChildren: () => import('@gosi-ui/features/payment').then(mod => mod.PaymentModule),
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

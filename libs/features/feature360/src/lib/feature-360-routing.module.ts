/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { Feature360Component } from './feature-360.component';

export const routes: Routes = [
  {
    path: '',
    component: Feature360Component,
    children: [
      {
        path: '',
        loadChildren: () => import('./feature-type/feature-type.module').then(mod => mod.FeatureTypeModule)
      },
      {
        path: 'establishments',
        loadChildren: () => import('./establishments/establishments.module').then(mod => mod.EstablishmentsModule)
      },
      {
        path: 'individuales',
        loadChildren: () => import('./individual/individual.module').then(mod => mod.IndividualModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Feature360RoutingModule {}

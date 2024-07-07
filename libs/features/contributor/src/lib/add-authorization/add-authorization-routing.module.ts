/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAuthorizationScComponent, ViewAuthorizationScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new',
    component: AddAuthorizationScComponent
  },
  {
    path: 'new',
    component: AddAuthorizationScComponent
  },
  {
    path: 'edit',
    component: AddAuthorizationScComponent
  },
  {
    path: 'view',
    component: ViewAuthorizationScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAuthorizationRoutingModule {}

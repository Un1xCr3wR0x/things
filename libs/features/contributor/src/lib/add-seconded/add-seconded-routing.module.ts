/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSecondedScComponent } from './components';

const routes: Routes = [
  {
    path: 'add',
    component: AddSecondedScComponent
  },
  {
    path: 'add/edit',
    component: AddSecondedScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSecondedRoutingModule {}

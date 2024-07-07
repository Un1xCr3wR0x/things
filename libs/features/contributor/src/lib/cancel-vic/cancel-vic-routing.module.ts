/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancelVicScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CancelVicScComponent
  },
  {
    path: 'edit',
    component: CancelVicScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelVicRoutingModule {}

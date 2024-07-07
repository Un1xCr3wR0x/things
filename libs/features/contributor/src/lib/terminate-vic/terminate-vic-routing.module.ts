/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminateVicScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: TerminateVicScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.TERMINATE-VIC'
    }
  },
  {
    path: 'edit',
    component: TerminateVicScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.TERMINATE-VIC'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminateVicRoutingModule {}

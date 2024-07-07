/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VirtualVisitDcComponent } from './components/virtual-visit-dc/virtual-visit-dc.component';
import { HttpClientModule } from '@angular/common/http';

/**
 * Declaration of routes for Dashboard feature
 */
const routes: Routes = [
  {
    path: '',
    component: VirtualVisitDcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule]
})
export class VirtualVisitRoutingModule {}

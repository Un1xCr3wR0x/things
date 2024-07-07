/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RaiseItsmDetailsScComponent, RaiseItsmScComponent } from './components';
/**
 * Declaration of routes for itsm module
 */
const routes: Routes = [
  {
    path: '',
    component: RaiseItsmScComponent
  },
  {
    path: 'itsmDetails/:id',
    component: RaiseItsmDetailsScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItsmComplaintsRoutingModule {}

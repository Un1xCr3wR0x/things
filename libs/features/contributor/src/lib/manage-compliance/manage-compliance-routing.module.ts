/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EInspectionScComponent } from './components/e-inspection-sc/e-inspection-sc.component';

const routes: Routes = [
  { path: '', redirectTo: 'e-inspection' },
  { path: 'e-inspection', component: EInspectionScComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageComplianceRoutingModule {}

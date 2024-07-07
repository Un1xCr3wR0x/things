/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestReinspectionScComponent } from './components/request-reinspection-sc/request-reinspection-sc.component';
import { InitiateSafetyCheckScComponent } from './components/initiate-safety-check-sc/initiate-safety-check-sc.component';
import { SafetyEvaluationScComponent } from './components/safety-evaluation-sc/safety-evaluation-sc.component';
export const routes: Routes = [
  {
    path: 'request-reinspection',
    component: RequestReinspectionScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.REQUEST-REINSPECTION'
    }
  },
  {
    path: 'initiate-safety-check',
    component: InitiateSafetyCheckScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.INITIATE-OCCUPATIONAL-SAFETY-CHECK'
    }
  },
  { path: 'self-evaluation', component: SafetyEvaluationScComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OhSafetyInspectionRoutingModule {}

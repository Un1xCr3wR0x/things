/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthInsuranceScComponent } from '@gosi-ui/features/contributor/lib/health-insurance/components';

const routes: Routes = [
  {
    path: '',
    component: HealthInsuranceScComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthInsuranceRoutingModule { }

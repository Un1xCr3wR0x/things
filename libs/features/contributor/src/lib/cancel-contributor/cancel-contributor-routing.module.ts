/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngagementActionGuard } from '../shared/guards';
import { CancelContributorScComponent, CancelEngagementIndScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    canActivate: [EngagementActionGuard],
    component: CancelContributorScComponent
  },
  {
    path: 'edit',
    component: CancelContributorScComponent
  },
  {
    path: 'request',
    component: CancelEngagementIndScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelContributorRoutingModule {}

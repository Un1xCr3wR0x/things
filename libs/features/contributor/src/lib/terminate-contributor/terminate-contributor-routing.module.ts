/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngagementActionGuard } from '../shared/guards';
import { TerminateContributorScComponent, TerminateEngagementIndScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    canActivate: [EngagementActionGuard],
    component: TerminateContributorScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.TERMINATE-CONTRIBUTOR'
    }
  },
  {
    path: 'edit',
    component: TerminateContributorScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.TERMINATE-CONTRIBUTOR'
    }
  },
  {
    path: 'request',
    component: TerminateEngagementIndScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.TERMINATE-CONTRIBUTOR'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminateContributorRoutingModule {}

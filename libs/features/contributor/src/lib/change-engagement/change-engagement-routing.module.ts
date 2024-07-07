/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeEngagementIndScComponent, IndividualEngagementScComponent } from './components';
import { EngagementActionGuard } from '../shared/guards';

const routes: Routes = [
  { path: '', redirectTo: 'change' },
  { path: 'change', component: IndividualEngagementScComponent, canActivate: [EngagementActionGuard] },
  { path: 'change/edit', component: IndividualEngagementScComponent },
  { path: 'wage-breakup', component: IndividualEngagementScComponent },
  { path: 'change/request', component: ChangeEngagementIndScComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeEngagementRoutingModule {}

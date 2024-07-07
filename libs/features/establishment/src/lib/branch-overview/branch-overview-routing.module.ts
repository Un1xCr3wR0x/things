/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchOverviewScComponent } from './components/branch-overview-sc/branch-overview-sc.component';

export const routes: Routes = [{ path: '', component: BranchOverviewScComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchOverviewRoutingModule {}

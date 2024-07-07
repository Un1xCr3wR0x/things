/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContributorScComponent, ProactiveScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: AddContributorScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.ADD-CONTRIBUTOR'
    }
  },
  {
    path: 'edit',
    component: AddContributorScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.ADD-CONTRIBUTOR'
    }
  },
  {
    path: 'proactive',
    component: ProactiveScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddContributorRoutingModule {}

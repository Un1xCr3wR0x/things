/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactivateVicScComponent } from './components/reactivate-vic-sc/reactivate-vic-sc.component';

const routes: Routes = [
  {
    path: '',
    component:ReactivateVicScComponent 

  },
  { path: 'edit',
  component: ReactivateVicScComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule],
  exports: [RouterModule]
})
export class ReactivateVicRoutingModule { }

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactivateScComponent } from './components/reactivate-sc/reactivate-sc.component';

const routes: Routes = [
  {
    path: '',
    component: ReactivateScComponent

  },
  { path: 'edit',
  component: ReactivateScComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule],
  exports: [RouterModule]
})
export class ReactivateRoutingModule { }

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViolationHistoryScComponent } from './components';

export const routes: Routes = [
  { path: '', component: ViolationHistoryScComponent },
  {
    path: ':registrationNo',
    component: ViolationHistoryScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class ViolationHistoryRoutingModule {}

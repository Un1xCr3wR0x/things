/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViolationAppealScComponent } from './components/violation-appeal-sc/violation-appeal-sc.component';

export const routes: Routes = [
  { path: '', component: ViolationAppealScComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})


export class ViolationAppealRoutingModule{}

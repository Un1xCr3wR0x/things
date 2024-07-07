/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMemberScComponent, MbPersonalDetailsDcComponent } from './components';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';

export const routes: Routes = [
  { path: 'refresh', component: RefreshDcComponent, pathMatch: 'full' },
  { path: '', component: AddMemberScComponent },
  { path: 'edit', component: AddMemberScComponent },
  { path: 'details', component: MbPersonalDetailsDcComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class AddMemberRoutingModule {}

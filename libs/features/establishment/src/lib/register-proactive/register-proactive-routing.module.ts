/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { RegisterProactiveScComponent } from './components';

export const routes: Routes = [
  {
    path: ':registrationNo/missing-details',
    component: RegisterProactiveScComponent,
    canDeactivate: [TransactionStateGuard]
  },
  { path: 'edit/missing-details', component: RegisterProactiveScComponent, canDeactivate: [TransactionStateGuard] },
  { path: 'refresh', component: RefreshDcComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class RegisterProactiveRoutingModule {}

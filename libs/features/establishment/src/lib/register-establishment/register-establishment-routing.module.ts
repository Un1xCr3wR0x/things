/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { EstablishmentSearchScComponent, RegisterEstablishmentScComponent } from './components';

export const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: 'verify', component: EstablishmentSearchScComponent },
  { path: 'validate', component: RegisterEstablishmentScComponent, canDeactivate: [TransactionStateGuard] },
  { path: 'new', component: RegisterEstablishmentScComponent, canDeactivate: [TransactionStateGuard] }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class RegisterEstablishmentRoutingModule {}

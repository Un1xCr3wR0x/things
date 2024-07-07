/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentAllinformationScComponent } from './components';
import { EstablishmentsBranchesScComponent } from './components/establishments-branches-sc/establishments-branches-sc.component';
// import { FeatureSearchScComponent } from './components/feature-search-sc/feature-search-sc.component';

export const routes: Routes = [
  { path: 'branches/:estId', component: EstablishmentsBranchesScComponent },
  { path: 'details/:regNum', component: EstablishmentAllinformationScComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class EstablishmentsRoutingModule {}

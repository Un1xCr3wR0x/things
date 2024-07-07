/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualAllinformationScComponent } from './components';
// import { FeatureSearchScComponent } from './components/feature-search-sc/feature-search-sc.component';

export const routes: Routes = [
  {
    path: 'details/:niNum',
    component: IndividualAllinformationScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.COMPLETE-ESTABLISHMENT-DETAILS'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class IndividualRoutingModule {}

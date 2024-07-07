/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureSearchScComponent } from './components/feature-search-sc/feature-search-sc.component';

export const routes: Routes = [{ path: 'type', component: FeatureSearchScComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class FeatureTypeRoutingModule {}

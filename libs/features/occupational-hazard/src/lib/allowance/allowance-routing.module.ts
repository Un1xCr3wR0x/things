/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AllowanceDcComponent } from './allowance-dc.component';
import { AllowanceDetailsScComponent } from './allowance-details-sc/allowance-details-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: AllowanceDcComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      {
        path: 'info',
        component: AllowanceDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS'
        }
      },
      {
        path: 'detail',
        component: AllowanceDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceRoutingModule {}

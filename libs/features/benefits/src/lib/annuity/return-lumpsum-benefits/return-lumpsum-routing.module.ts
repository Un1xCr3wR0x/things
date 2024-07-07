import { Routes, RouterModule } from '@angular/router';
import { ReturnLumpsumScComponent } from './return-lumpsum-sc/return-lumpsum-sc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestoreLumpsumScComponent } from './restore-lumpsum-sc/restore-lumpsum-sc.component';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ReturnLumpsumScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'restore',
        component: RestoreLumpsumScComponent,
        data: {
          breadcrumb: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnLumpsumRoutingModule {}

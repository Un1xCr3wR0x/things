/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidatorDcComponent } from './validator-dc.component';
import { EmployeeAppealScComponent } from './components/establishment-private-appeal';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'appeal',
        component: EmployeeAppealScComponent,
        data: {
          breadcrumb: ''
        }
      }
      // {
      //   path: 'appeal',
      //   component: ValidateAppealScComponent,
      //   data: {
      //     breadcrumb: ''
      //   }
      // }

      /*,
      {
        path: 'appeal-on-violation',
        component: ValidateAppealOnViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.APPEAL_DETAILS'
        }
      }*/
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}

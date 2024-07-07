/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ValidatorAdjustmentRepaymentScComponent,
  ValidatorModifyThirdpartyAdjustmentScComponent,
  ValidatorAdjustmentScComponent,
  ValidatorThirdpartyAdjustmentScComponent,
  ValidatorAdjustmentHeirScComponent
} from './components';

export const routes: Routes = [
  {
    path: 'view',
    component: ValidatorAdjustmentScComponent
  },
  {
    path: 'tpaView',
    component: ValidatorThirdpartyAdjustmentScComponent
  },
  {
    path: 'maintainTpaView',
    component: ValidatorModifyThirdpartyAdjustmentScComponent
  },
  {
    path: 'approve-adjustment-repayment',
    component: ValidatorAdjustmentRepaymentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.RECOVER-ADJUSTMENTS'
    }
  },
  {
    path: 'heir-adjustment',
    component: ValidatorAdjustmentHeirScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorAdjustmentRoutingModule {}

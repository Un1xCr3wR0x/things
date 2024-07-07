/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViolationProfileScComponent, ModifyPenaltyAmountScComponent, CancelViolationScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: ViolationProfileScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
    }
  },
  {
    path: 'modify-penalty',
    component: ModifyPenaltyAmountScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
    }
  },
  {
    path: 'cancel-violation',
    component: CancelViolationScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.CANCEL-VIOLATIONS'
    }
  },
  {
    path: 'modify-penalty/edit',
    component: ModifyPenaltyAmountScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
    }
  },
  {
    path: 'cancel-violation/edit',
    component: CancelViolationScComponent,
    data: {
      breadcrumb: 'VIOLATIONS.CANCEL-VIOLATIONS'
    }
  }
  // {
  //   path: 'refresh',
  //   component: RefreshDcComponent
  // },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class ViolationProfileRoutingModule {}

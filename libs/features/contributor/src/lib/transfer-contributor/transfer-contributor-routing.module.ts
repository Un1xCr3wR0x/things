/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualTransferScComponent } from './individual-transfer/components';
import { TransferAllScComponent } from './transfer-all/components';
import { MultipleTransferScComponent } from './multiple-transfer/components/multiple-transfer-sc/multiple-transfer-sc.component';

const routes: Routes = [
  {
    path: 'individual',
    component: IndividualTransferScComponent
  },
  {
    path: 'individual/edit',
    component: IndividualTransferScComponent
  },
  {
    path: 'all',
    component: TransferAllScComponent
  },
  {
    path: 'all/edit',
    component: TransferAllScComponent
  },
  {
    path: 'multiple',
    component: MultipleTransferScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferContributorRoutingModule {}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { ViewFlagDetailsScComponent, ModifyFlagScComponent, AddFlagScComponent } from './components';

export const routes: Routes = [
  {
    path: ':regNo/view',
    component: ViewFlagDetailsScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.ESTABLISHMENT-FLAGS'
    }
  },
  {
    path: 'add-flag',
    component: AddFlagScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.ADD-FLAG'
    }
  },
  {
    path: ':registrationNo/:flagId',
    component: ModifyFlagScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.MODIFY-FLAG'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlagEstablishmentRoutingModule {}

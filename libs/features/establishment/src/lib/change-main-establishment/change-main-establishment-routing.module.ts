/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { ChangeMainEstablishmentScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: ChangeMainEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.CHANGE-MAIN-EST'
    }
  },
  {
    path: 'modify',
    component: ChangeMainEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.CHANGE-MAIN-EST'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeMainEstablishmentRoutingModule {}

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { TerminateEstablishmentScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'request',
    pathMatch: 'full'
  },
  {
    path: 'request',
    component: TerminateEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.CLOSE-ESTABLISHMENT'
    }
  },
  {
    path: 'modify',
    component: TerminateEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.CLOSE-ESTABLISHMENT'
    }
  },
  {
    path: 're-enter',
    component: TerminateEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.CLOSE-ESTABLISHMENT'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminateEstablishmentRoutingModule {}
